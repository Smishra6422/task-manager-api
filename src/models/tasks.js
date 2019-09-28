const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({

    user:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        validate(value) {
            if(value.includes('user')) {
                throw new Error ('user name cannot be "user" ')
            }
        }
    },
    discription:{
        type:String,
        required:true,
        trim:true

    },
    completed:{
        type:Boolean,
        default:false

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Tasks',taskSchema)

module.exports = Task