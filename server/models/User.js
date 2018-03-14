const mongoose = require('mongoose');

var User = mongoose.model('User',{
    email:{
        type: String,
        required:true,
        minlength:1,
        trim:true
    }
});

// var orUser = new User({
//     email:'  ormo2  '
// });

// orUser.save().then((res) => {
//     console.log(`User ${res}`);
// },((err) => {
//     console.log(`err ${err}`);
// }));

module.exprots = {User};