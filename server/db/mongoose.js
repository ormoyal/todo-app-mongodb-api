const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

console.log('process.env ',process.env);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAppDB');

module.exports = {mongoose};