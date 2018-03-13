const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoAppDB', function(err, client){
    if(err)
        return console.log(`err connecting to the MongoDB in the server, ${err}`);
    console.log('connect to MongoDB successfully');
    const db = client.db('TodoAppDB');
    
    // db.collection('Todos').insertOne({
    //      text:'somting to do',
    //      completed:false
    // }, (err,results) => {
    //     if(err)
    //         return console.log(`err create collaction, ${err}`);
    //     console.log('11 ',results.ops);
    // })

    // db.collection('Users').insertOne({
    //     name:'or',
    //     age:21,
    //     location:'beer sheva'
    // }, (err, results) => {
    //     if(err)
    //         return console.log(`err to create collaction, ${err}`);
    //     console.log(`collection created successfully, ${JSON.stringify(results.ops)}`);
    //     console.log(results.ops[0]._id.getTimestamp())
    // });


    client.close();
});