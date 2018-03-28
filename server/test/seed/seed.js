const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/Todo');
const {User} = require('./../../models/User');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID(), userTwoId = new ObjectID();

var users = [{
	_id: userOneId,
	email:'ormoyal@decon.co.il',
	password:'123456',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id:userOneId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
},{
	_id:userTwoId,
	email:'ormoyal2@decon.co.il',
    password:'123456',
    tokens: [{
		access: 'auth',
		token: jwt.sign({_id:userTwoId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const populateUsers = (done) => {
	User.remove({}).then(() => {

		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save(); 

		return Promise.all([userOne,userTwo]);

	}).then(() => done());
};


var todos = [{
	_id: new ObjectID(),
	text: 'eat all day',
    _user:userOneId
},{
	_id: new ObjectID(),    
	text: 'clean my room',
    _user:userTwoId    

}];

const populateTodos = (done) => {
	Todo.remove().then(() => {
		return Todo.insertMany(todos, (err) => {
			if(err) return done(err);   
		});
	}).then(() =>{
		done();   
	});
};


module.exports = {todos, populateTodos, users, populateUsers};