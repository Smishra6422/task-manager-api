const jwt = require('jsonwebtoken')
const User = require('../models/user')

// it will check the token coming from authorization and if exist then it will display the details of user //

const auth = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })

        if(!user) {
            throw new Error()
        }

        req.token = token
        
        req.user = user

        // return (req.user, next())
        // console.log(user);
        

        next()
        
    } catch (error) {
        res.status(401).send('Please authenticate!')
    }
    
}

module.exports = auth