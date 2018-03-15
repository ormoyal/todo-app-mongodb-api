const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

beforeEach((done) => {
    Todo.remove().then((res) => {
        // console.log(res)
        done();
    })
});

describe('/Todos - POST ', () => {

    it('shold add todo ', (done) => {
        var text =  'some text1';
        
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
            // return done();

        })
        .end((err,res) => {
            if(err) return done(err);

            // console.log(res);
            Todo.find().then((todos) => {
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
                expect(todos.length).toBe(0);
                done();
            }).catch(err => {
                done(err);
            })
        })
    })
})

