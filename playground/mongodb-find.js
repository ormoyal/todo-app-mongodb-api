const {MongoClient,ObjectID} = require('mongodb');

var objID = new ObjectID();
// console.log(objID);

MongoClient.connect('mongodb://localhost:27017/TodoAppDB', function(err, client){
    if(err)
        return console.log(`err connecting to the MongoDB in the server, ${err}`);
    console.log('connect to MongoDB successfully');

    const db = client.db('TodoAppDB');
    
    db.collection('Users').find({name:'or'}).toArray().then(todos => {
        console.log(`Todos\n${JSON.stringify(todos,undefined,2)}`)
    },err => {
        console.log(err);
    })
    
    db.collection('Todos').find().count().then(todos => {
        console.log(`Todos count: ${todos}`)
    },err => {
        console.log(err);
    })
    /* work also with CB, for example
        db.collection('Todos').find().count((err,todos) => {
            if(err) return console.log('err ',err);
            console.log(`Todos count: ${todos}`)
        });
    */

    client.close();
});