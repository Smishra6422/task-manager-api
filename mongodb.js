//CURD (Create Update Read Delete) operations

const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const connectionUrl = 'mongodb://127.0.0.1:27017'

const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser:true ,useUnifiedTopology:true}, (error, client) => {
    if(error) {
      return  console.log('Unable to connect with database!');
        
    } 

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name:'shubham',
    //     age:27
    // })

    // db.collection('task').insertMany([
    //   {
    //   discription:'this is first user',
    //   completed:true
    //   }, {
    //     discription:'this is second user',
    //     completed:false
    //   }
    // ], (error, result) =>{
    //   if(error) {
    //   return  console.log('Unable to insert the user data');
        
    //   } 

    //   console.log(result.ops);
      
    // })

    // db.collection('users').find({name:'shubham'}).toArray( (error, user) => {
    //   if(error) {
    //   return  console.log('Unable to find user data!');
        
    //   }

    //   console.log(user);
      
    // })

    // db.collection('task').updateMany({
    //   completed:true
    // }, {
    //   $set:{
    //     description:'this is first work to be done'
    //   }
    // }).then(result =>{
    //   console.log(result.modifiedCount);
      
    // }).catch(error =>{
    //   console.log(error);
      
    // })
    
    db.collection('users').deleteOne({
      name:'shubham'
    }).then(result => {
      console.log(result.deletedCount);
      
    }).catch(error => {
      console.log(error);
      
    })
})