const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');


// Todo.remove()
// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

//  Todo.remove({}).then(results => {
//      console.log(results);
//  })

// Todo.findByIdAndRemove('5aae3fa934c05dac45239f71').then((todo) => {
//     console.log(todo);
// })