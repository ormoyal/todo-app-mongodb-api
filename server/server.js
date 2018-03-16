const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');

const {User} = require('./models/User');
const {Todo} = require('./models/Todo');

var app = express();

app.listen(3000,(res,ee,rr) => {
    console.log(`started on port 3000 `);
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
    if(!ObjectID.isValid(id)) return res.status(404).send('id is not valid');

    Todo.findById(id).then(todo => {
        if(!todo) return res.status(404).send('user not found');
        res.send({todo});
    }).catch(err => {
        res.status(400).send()
    })
    
});

module.exports = {app};



