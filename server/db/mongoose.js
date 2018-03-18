const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath, options;
//Check if we are on Heroku

if(process.env.NODE_ENV === 'production'){
 process.env.MONGODB_URI = "mongodb://Admin:orAdmin123@ds115799.mlab.com:15799/mongodb-todo-app-api";
 options= {
     auth: {
         user: 'Admin',
         password: 'orAdmin123'
     }
 }
}else{
//  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppDB";
 options = {}
}


mongoose.connect(process.env.MONGODB_URI, options);

module.exports = {mongoose};