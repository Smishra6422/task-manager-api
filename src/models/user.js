const mongoose = require('mongoose')
const validator = require('validator')
const Task = require('./tasks')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            } 
        }

    },
    password:{
        type: String,
        required:true,
        trim:true,
        minlength:6,
        validate(value) {
            if(value.includes('password')) {
                throw new Error('password not be equal to "password" ')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})


userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

// To hide the password
// work on the instances of User Model

// This function will work on the res.send methods  (  not on console.log and   user.save method  ) //

// Because send method call stringyfy method whenever it called and 
//  (  toJSON method called automatically called when Stringify called by res.send method ) 
// When res.send called

userSchema.methods.toJSON = function () {

    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


// userSchema.methods

// methods used for instances 

//to generate the token for login and user 

userSchema.methods.generateAuthToken = async function () {
    const user = this
    // this is used to access the current user with the request has been made //
    
    

    const token = await jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// statics is used for model

// to check the user exist in the database

userSchema.statics.findByCredential = async (email, password) => {

    const user = await User.findOne({ email })

    if(!user) {
        throw new Error()
        // return ('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error()
    }

    return user
}

userSchema.pre('save', async function (next) {

    // console.log("hello");
    
    // here user is instances of the USER MODEL

    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
    
})


userSchema.pre('remove', async function (next) {

    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User',userSchema)


module.exports = User