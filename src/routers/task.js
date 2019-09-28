const express = require('express')
const Task = require('../models/tasks')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/tasks', auth, async (req, res) => {

    // res.send(req.body)
    // const task_detail = new Task(req.body)

    const task_detail = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task_detail.save()
        res.send(task_detail)
    } catch (error) {
        res.status(400).send(error)
    }
    
})

// match is use for filtering the data
// options is use for pagination
// GET /task?completed=true
// GET /task?limit=2&skip=1
// GET /task?sortBy=createdAt:desc

router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'  // it will return the true value
        
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')  // it will return a array 
        // console.log(parts);
        

        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
         
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

        // const task = await Task.find({ owner: req.user._id })
        // res.send(task)

    } catch (error) {
        res.status(500).send(error)
    }

})

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {
    //   const task = await Task.findById(_id)

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('no task found!')
        }
        res.send(task)

    } catch (error) {
        res.status(500).send(error)
    }

})


router.patch('/tasks/:id', auth, async (req, res) => {

    const update = Object.keys(req.body)
    const allowUpdate = ['completed','user','discription']
    const isValidOperation = update.every((update) => {
        return allowUpdate.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send('invalid updates')
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true})

        // const task = await Task.findById(req.params.id)

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        
         if(!task) {
          return  res.status(404).send('Task does not exists!')
        }

        update.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        // const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task)  {
          return  res.status(404).send('Task you want to delete does not exists!')
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router