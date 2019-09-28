require('../src/db/mongoose')
const Task = require('../src/models/tasks')

// Task.findByIdAndDelete('5d70ef51d7d4dd1a90540fc5').then(() => {
//     return Task.countDocuments({completed:false})
// }).then((data_count) => {
//     console.log(data_count);
    
// }).catch((error) => {
//     console.log(error);
    
// })

// const updateAgeAndCount = async (id, completed) => {      
//     const task = await Task.findByIdAndUpdate(id,{ completed }) 
//     const count = await Task.countDocuments({ completed })
//     return count
// }

// updateAgeAndCount('5d7104cbd223481214ebf1a9', true).then((count) => {
//     console.log(count);
    
// }).catch((error) => {
//     console.log(error);
    
// })

const deleteAndUpdate = async (id, completed) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed })
    return count
}

deleteAndUpdate('5d7104cbd223481214ebf1a9', false).then((count) => {
    console.log(count);
    
}).catch((error) => {
    console.log(error);
    
})