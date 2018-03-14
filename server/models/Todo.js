const mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    text:{
        type: String,
        required:true,
        minlength:1,
        trim:true
    },
    completed:{
        type: Boolean,
        default:false
        
    },
    completedAt:{
        type: Number,
        default: null
    }
});

// var newTodo = new Todo({
//     text:'   check  '
// });

// newTodo.save().then((res) => {
//     console.log('1 ',JSON.stringify(res,undefined,2));
// },(err) => {
//     console.log('2 ',err);
// })

module.exports = {Todo};