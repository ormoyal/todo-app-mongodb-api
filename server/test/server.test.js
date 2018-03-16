const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

todos = [{
    text: 'eat all day'
},{
    text: 'clean my room'
}];

beforeEach((done) => {
    Todo.remove().then(() => {
       return Todo.insertMany(todos, (err,docs) => {
           if(err) return done(err);      
        //    done();
       });
    }).then(() => done());
});

describe('/Todos - POST ', () => {

    it('shold add todo ', (done) => {
        var text =  'some text1';
        
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            console.log(res.body.text);
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
        // console.log('noy');
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
            })
        })
    })
})


describe('Get /todos',() => {
    it('should return all todos', (done) => {

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2)
        })
        .end(done);

    })
})

