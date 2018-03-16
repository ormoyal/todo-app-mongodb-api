const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');


// var someOne = new User({
//     email:'ormoyallllll'
// })

// let id = '5aabae38932bc608706e60121';

// if(!ObjectID.isValid(id))
//     return console.log('the ID is not valid'); 

// Todo.find({_id: id}).then((todo) => {
//     console.log('find ',todo);
// })

// Todo.findOne({_id: id}).then((todo) => {
//     console.log('findOne ',todo);
// })

// Todo.findById(id).then((todo) => {
//     if(!todo)
//         return console.log(`id not found`);
    
//     console.log('findOneById ',todo);
// }).catch((err) => {
//     console.log(err);
// }) 

var userID = '5aa87559a93ce2503421eeff';
if(!ObjectID.isValid(userID)) return console.log('ID is not valid');

User.findById(userID).then((user) => {
    if(!user) return console.log('user not found');
    console.log(user);
}).catch((err) => {
    console.log(err);
});