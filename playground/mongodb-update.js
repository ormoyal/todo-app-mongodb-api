const {MongoClient,ObjectID} = require('mongodb');

// console.log(objID);

MongoClient.connect('mongodb://localhost:27017/TodoAppDB', function(err, client){
    if(err)
        return console.log(`err connecting to the MongoDB in the server, ${err}`);
    console.log('connect to MongoDB successfully');

    const db = client.db('TodoAppDB');

    db.collection('Users').findOneAndUpdate({name:'or',age:35},
    {
        $set:{
            name:'dani'
        },
        $inc:{
            age: 1
        }
    },
    {returnOriginal: false}
).then((result) => {
        console.log('result ',result);
    },(err) => {
        console.log('err ',err);        
    })  

    client.close();
});