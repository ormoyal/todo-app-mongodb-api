const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcryptjs = require('bcryptjs');


var userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '\"{VALUE}\" is not a valid email'
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

// userSchema.methods.toJSON = function(){
//     let user = this;

//     // console.log('user ',user.email);

//     // var userObj = user.toObject();
//     //  console.log(userObj.email);
//     return _.pick(user,['_id','email']);
// }


userSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth'
    let token = jwt.sign({_id:user._id.toHexString(), access},'mySaltSecret').toString();

   user.tokens = user.tokens.concat([{access,token}]);

   return user.save().then(() => {
       return token;
   })
};

userSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'mySaltSecret');
    } catch(e){
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}; 

userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        bcryptjs.genSalt(10,(err,salt) => {
            if(err) next('bad');
            bcryptjs.hash(user.password,salt,(err,encryptedPassword) => {
                if(err) next(err);
                user.password = encryptedPassword;
                next();
            });
        })
    }else{
        next();
    }

});



var User = mongoose.model('User',userSchema);


module.exports = {User};