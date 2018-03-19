const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        } 
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]

});

userSchema.methods.toJSON = function(){
    let user = this;
    var userObj = user.toObject();

    return _.pick(userObj,['_id','email']);
}


userSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth'
    let token = jwt.sign({_id:user._id.toHexString(),access},'mySaltSecret').toString();

    console.log(token);

   user.tokens.push({access,token});

   return user.save().then(() => {
       return token;
   })
}

var User = mongoose.model('User',userSchema);

// var orUser = new User({
//     email:'  ormo2  '
// });

// orUser.save().then((res) => {
//     console.log(`User ${res}`);
// },((err) => {
//     console.log(`err ${err}`);
// }));

module.exports = {User};