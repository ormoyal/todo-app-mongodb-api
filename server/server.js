require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/User');
const {Todo} = require('./models/Todo');
const {authentication} = require('./middleware/authentication');

var app = express();

const port = process.env.PORT;

app.listen(port,() => {
    console.log(`started on port ${port} `);
});

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then(result => {
        res.send(result);
    },e => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req,res,n) => {

    Todo.find().then((todos) => {
        // console.log(`n ${n}`);
        res.send({todos}) 
    },err => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req,res) => {
    
    var id = req.params.id;

    if(!ObjectID.isValid(id)) return res.status(400).send('id is not valid');

    Todo.findById(id).then(todo => {
        if(!todo) return res.status(404).send('user not found');
        res.send({todo});
    }).catch(err => {
        res.status(400).send()
    })
    
});


app.delete('/todos/:id',(req,res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(400).send('id is not valid');

    Todo.findByIdAndRemove(id).then(todo => {
        if(!todo)
            return res.status(404).send('todo is not found');

        res.send({todo});
    }).catch(err => {
        res.send(400).send(err);
    });

});

app.patch('/todos/:id', (req,res) => {
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

    Todo.findByIdAndUpdate(id,{$set: body},{new:true}).then(updated => {
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
    })

});

app.get('/users/me',authentication,(req,res) => {

    res.send(req.user);

});



module.exports = {app};



