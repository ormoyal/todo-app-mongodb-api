
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
			message: '"{VALUE}" is not a valid email'
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
	// let user = this;
	// console.log('user ',JSON.stringify(user.email,undefined,2));
	// var userObj = user.toObject();
	//  console.log('hhhhh ',JSON.stringify(userObj.email,undefined,2));
	return _.pick(this.toObject(),['_id','email']);
};


userSchema.methods.generateAuthToken = function(){

    let user = this;
	let access = 'auth';
	let token = jwt.sign({_id:user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(() => {
		return token;
	});
};

userSchema.methods.removeToken = function(token){
    var user = this;

    return user.update({
        $pull: {
            tokens:{
                token:token
            }
        }
    });
}

userSchema.statics.findByToken = function(token){
	var User = this;
	var decoded;
	try{
		decoded = jwt.verify(token, process.env.JWT_SECRET);
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
			if(err) next('salt cannot generate');
			bcryptjs.hash(user.password,salt,(err,encryptedPassword) => {
				if(err) next(err);
				user.password = encryptedPassword;
				next();
			});
		});
	}else{
		next();
	}
});

userSchema.statics.findByCredentials = function(email,password){
	let User = this;
	return User.findOne({email}).then(user => {
		if(!user) return Promise.reject('wrong password or password, please try again');
		return new Promise((resolve,reject) => {
			bcryptjs.compare(password,user.password,(err,match) => {
				if(err) reject(err);
                if(!match)  reject('wrong password or password, please try again');
				resolve(user);
			});
		});
	});
};



var User = mongoose.model('User',userSchema);


module.exports = {User};