require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mongoose');
const {User} = require('./models/User');
const {Todo} = require('./models/Todo');
const {authentication} = require('./middleware/authentication');

var app = express();

const port = process.env.PORT;

app.listen(port,() => {
	console.log(`started on port ${port}`);
});

app.use(bodyParser.json());

app.post('/todos', authentication, (req,res) => {
	var todo = new Todo({
		text: req.body.text,
		_user: req.user._id
	});
	todo.save().then(result => {
		res.send(result);
	},e => {
		res.status(400).send(e);
	});
});

app.get('/todos', authentication, (req,res) => {
	Todo.find({
		_user: req.user._id
	}).then((todos) => {
		res.send({todos}); 
	},err => {
		res.status(400).send(err);
	});
});

app.get('/todos/:id', authentication, (req,res) => {
    
	var id = req.params.id;

	if(!ObjectID.isValid(id)) return res.status(400).send('id is not valid');
	
	Todo.findOne({
		_id:id,
		_user:req.user._id
	}).then(todo => {
		if(!todo) return res.status(404).send();
		res.send({todo});
	}).catch(err => {
		res.status(400).send(err);
	});
});


app.delete('/todos/:id', authentication, (req,res) => {
	let id = req.params.id;

	if(!ObjectID.isValid(id))
		return res.status(400).send('id is not valid');

	Todo.findOneAndRemove({_id: id, _user: req.user._id}).then(todo => {
		if(!todo)
			return res.status(404).send('todo is not found');

		res.send({todo});
	}).catch(err => {
		res.send(400).send(err);
	});

});

app.patch('/todos/:id', authentication, (req,res) => {
	let id = req.params.id;    
	let body = _.pick(req.body, ['text','completed']);

	if(!ObjectID.isValid(id))
		return res.status(400).send('id is not valid');

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	}else{
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({_id: id, _user: req.user._id},{$set: body},{new:true}).then(updated => {
		if(!updated)
			return res.status(404).send('id is not found');

		res.send({updated});
	}).catch(err => {
		res.status(400).send(err);
	});
});

app.post('/users', (req,res) => {
	let userDetails = _.pick(req.body,['email','password']);

	let user = new User(userDetails);
	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth',token).send(user);
	}).catch(e => {
		res.status(400).send(e);
		// console.log(e);
	});

});

app.get('/users/me',authentication,(req,res) => {
	res.send(req.user);
});

app.post('/users/login',(req,res) => {
	let body = _.pick(req.body,['email','password']);
    
	User.findByCredentials(body.email,body.password).then(user => {
		return user.generateAuthToken().then(token => {
			res.header('x-auth',token).send(user);
		});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.delete('/users/logout',authentication, (req,res) => {

	req.user.removeToken(req.token).then(() => {
		res.status(200).send('logout successfully');
	}).catch(e => {
		res.status(400).send(e);
	})

})


module.exports = {app};



