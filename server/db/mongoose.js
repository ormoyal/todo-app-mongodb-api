const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath, options;
//Check if we are on Heroku

// mongoose.connect('mongodb://Admin:orAdmin123@ds115799.mlab.com:15799/mongodb-todo-app-api', {
//     auth: {
//         user: 'Admin',
//         password: 'orAdmin123'
//     }
//   })
//   .then(() => console.log('connection successful'))
//   .catch((err) => console.error(err));


if(process.env.PORT){
 connectPath = "mongodb://Admin:orAdmin123@ds115799.mlab.com:15799/mongodb-todo-app-api";
 options= {
     auth: {
         user: 'Admin',
         password: 'orAdmin123'
     }
 }
}else{
 connectPath = "mongodb://localhost:27017/TodoApp";
 options = {}
}
mongoose.connect(connectPath, options);

console.log('process.env.MONGODB_URI ',process.env.MONGODB_URI);
console.log('process.env.PORT ',process.env.PORT);


// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAppDB');

module.exports = {mongoose};