const {MongoClient,ObjectID} = require('mongodb');

// console.log(objID);

MongoClient.connect('mongodb://localhost:27017/TodoAppDB', function(err, client){
    if(err)
        return console.log(`err connecting to the MongoDB in the server, ${err}`);
    console.log('connect to MongoDB successfully');

    const db = client.db('TodoAppDB');

    // deleteMany()
    // deleteOne()
    // findOneAndDelete()

    // db.collection('Users').deleteMany({name:'or'},(err,result) => {
    //     console.log('result ',result);
    //     console.log('err ',err);
    // })

    // db.collection('Users').deleteOne({name:'or'}).then((deleted) => {
    //     console.log('delete ',deleted);
    // },(err) => {

    // });

    // db.collection('Users').findOneAndDelete({name:'noy'}).then((result) => {
    //     console.log('findOne ', result);
    // })

    // to('should delete 1 user', () => {
    
    // })

        db.collection('Users').findOneAndDelete({_id: new ObjectID("5aa7b984918d47b63d97868a")}).then(result => {
            console.log(result);
        },err => {
            console.log(err);
        })

    

    client.close();
});