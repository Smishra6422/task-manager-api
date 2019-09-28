require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('5d70ea65eee99e054cc591a5', {email:'sanjay'}).then((user) => {
    console.log(user);

    return User.countDocuments({email:'sanjay'})
    
}).then((user) => {
    console.log(user);
    
}).catch((error) => {
    console.log(error);
    
})