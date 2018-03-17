const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath, options;
//Check if we are on Heroku

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

module.exports = {mongoose};