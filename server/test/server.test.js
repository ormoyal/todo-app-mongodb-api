
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

var todos = [{
    _id: new ObjectID(),
    text: 'eat all day',
    versionKey:123
},{
    _id: new ObjectID(),    
    text: 'clean my room',
    versionKey:'haha'

}];

beforeEach((done) => {
    Todo.remove().then(() => {
       return Todo.insertMany(todos, (err,docs) => {
           if(err) return done(err);   
        //    done('2');  
       });
    }).then((send) => done());
});

describe('/Todos - POST ', () => {
    it('shold add todo ', (done) => {

        var text =  'some text1';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            // console.log(res.body.text);
            expect(res.body.text).toBe(text);
            // return done();
        })
        .end((err,res) => {
            if(err) return done(err);
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err) => {
                done(err);
            })

        })
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,results) => {
            if(err) return done(err);

            Todo.find().then(todos => {
                expect(todos.length).toBe(2);
                done();

            }).catch(err => {
                done(err);
            });
        });
    });
});


describe('Get /todos',() => {
    it('should return all todos', (done) => {

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2)
        })
        .end(done);
    });
});

describe('Get /todos/:id', () => {
    it('should return todo doc', (done) => {

        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[1].text)
        })
        .end(done);
    });
  
    it('should return 404 if todo not found', (done) => {

        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });
    
    it('should return 400 for non-object ids', (done) => {

        request(app)
        .get(`/todos/123`)
        .expect(400)
        .end(done);
    });
});

describe('Delete /todos/:id',() => {
    it('should remove a todo', done => {
        let id = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect(res => {
            expect(res.body.todo._id).toBe(id);
        })
        .end((err,res) => {
            if(err)
                return done(err);

            Todo.findById(res.body.todo._id).then(deletedTodo => {
                expect(deletedTodo).toBeFalsy();
                done();
            }).catch(e => done(e));
        })

    });

    it('should return 404 if todo not found', done => {
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('it should return 400 if object id isn\'t valid' , done => {
        request(app)
        .delete(`/todos/1234s4`)
        .expect(400)
        .end(done);
    });
});