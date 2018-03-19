const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Check if we are on Heroku

if(process.env.NODE_ENV === 'production'){
 process.env.MONGODB_URI = "mongodb://Admin:orAdmin123@ds115799.mlab.com:15799/mongodb-todo-app-api";
}

mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};