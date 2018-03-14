const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/User');
const {Todo} = require('./models/Todo');

var app = express();

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


app.listen(3000,(res,ee,rr) => {
    console.log(`started on port 3000 `);
})




