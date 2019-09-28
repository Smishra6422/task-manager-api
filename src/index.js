const express = require('express')
require('./db/mongoose')
const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')
const jwt = require('jsonwebtoken')

const app = express()

const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(503).send('Site is under maintenance. Check back soon!')
// })

// const token =  jwt.sign({id:'shubbham'}, 'thisissignature')
// const decode = jwt.verify(token, 'thisissignature')
// console.log(token);
// console.log(decode);



app.use(express.json())

app.use(userRoute)

app.use(taskRoute)






app.listen(port, () => {
    console.log('Server running at port'+port);
    
})

// const Task = require('../src/models/tasks')
// const User = require('../src/models/user')

// const main = async () => {
//     const task = await Task.findById('5d8989577c887606705c1abd')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner);
    
// }

// main()

// const multer = require('multer')

// const upload = multer({
//     dest:'profile'
// })

// app.post('/profile', upload.array('photos', 2), (req, res, next) => {

//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send(error)
// })