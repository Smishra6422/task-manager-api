const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { sendCancelEmail, sendWelcomeEmail } = require('../emails/account')
const multer = require('multer')
const router = new express.Router()




router.post('/users', async (req, res) => {

    // res.send(req.body)
    const user_detail = new User(req.body)

    try {
        await user_detail.save()
        
        
       await sendWelcomeEmail(user_detail.email)
      
        const token = await user_detail.generateAuthToken()
        
        res.status(201).send({ user_detail, token })
        
        
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
        // res.send(token)
    } catch (error) {
       res.status(401).send('Unable to login!')
   
    
    }
})

router.post('/users/logout', auth, async (req,res) => {

    try {
        
        req.user.tokens = req.user.tokens.filter((token) => {

            return token.token !== req.token

        })

      await  req.user.save()

      res.status(200).send('You are logged out')

    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {

    try {
        
        req.user.tokens = []

       await req.user.save()

        res.status(200).send('You are logout from all devices!')

    } catch (error) {
        res.status(400).send()
    }
})

router.get('/users/me', auth,async (req, res) => {

    // try {
    //   const users = await User.find({})
    //     res.send(users)
    // } catch (error) {
    //     res.status(500).send(error)
    // }

    res.send(req.user)

})

// router.get('/users/:id', async (req, res) => {

//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send('User not found')
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error)
//     }

   
// })

router.patch('/users/me', auth,async (req, res) => {

    const update = Object.keys(req.body)   // Object.keys convert the object into array of string //
    const allowUpdate = ['email','password']
    const isValidOperation = update.every((update) => {
        return allowUpdate.includes(update)
    })

    if(!isValidOperation) {
      return  res.status(400).send('invalid update!')
    }


    try {
        // const user = await User.findByIdAndUpdate( req.params.id, req.body, { new:true, runValidators:true })

        // const user = await User.findById(req.params.id)

        update.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        // if(!user) {
        //   return  res.status(404).send('User does not exist!')
        // }

        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)

        // if(!user) {
        //   return  res.status(404).send('User you want to delete does not exists!')
        // }

        await req.user.remove()

        await sendCancelEmail(req.user.email)

        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)
    }
})

const uploads = multer({
    // dest: 'avatars',         // use to save the file in local storage //
    limits:{
        fileSize: 1000000
    },
    fileFilter (req, file, callback) {

        // if(!file.originalname.match(/\.(pdf|ppt)$/)) {
        //    return callback(new Error('File must be pdf or ppt'))
        // }

        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Images must be in jpg/jpeg/png format!'))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, uploads.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {

        req.user.avatar = undefined

       await req.user.save()

       res.send()
    
        
    
})

router.get('/users/:id/avatar', async (req, res) => {

    try {
        
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')

        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router

