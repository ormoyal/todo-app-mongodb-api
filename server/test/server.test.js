
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// const mongoose = require('./../db/mongoose');
const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
const {User} = require('./../models/User');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
    


beforeEach(populateUsers);
beforeEach(populateTodos); 

describe('/Todos - POST ', () => {
	it('shold add todo ', (done) => {
		var text =  'some text1';
		request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res) => {
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
				});

			});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(1);
			})
			.end(done);
	});
});

describe('Get /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[1].text);
			})
			.end(done);
	});
  
	it('should not return todo doc created by other user', (done) => {
		request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
    
	it('should return 400 for non-object ids', (done) => {
		request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
			.expect(400)
			.end(done);
	});
});

describe('Delete /todos/:id',() => {
	it('should remove a todo', done => {
		let id = todos[0]._id.toHexString();
		request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
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
        });
    });
    
    it('should not remove a todo created by other user', done => {
		let id = todos[0]._id.toHexString();
		request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err,res) => {
            if(err)
                return done(err);

            Todo.findById(id).then(notDeletedTodo => {
                expect(notDeletedTodo).toBeTruthy();
                done();
            }).catch(e => done(e));
        });
	});

	it('should return 404 if todo not found', done => {
		request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
	});

	it('it should return 400 if object id isn\'t valid' , done => {
		request(app)
        .delete('/todos/1234s4')
        .set('x-auth', users[0].tokens[0].token)
        .expect(400)
        .end(done);
	});

});

describe('Patch /todos/:id',() => {
	it('should update the todo', (done) => {
		let id = todos[0]._id.toHexString();
		let text = 'lalala', completed = true;

		request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({text,completed})
        .expect(200)
        .expect(res => {
            expect(res.body.updated.text).toBe(text);
            expect(res.body.updated.completed).toBe(true);
            expect(typeof res.body.updated.completedAt).toBe('number');
        }).end(done);
    });
    
    it('should not update the todo created by other user', (done) => {
		let id = todos[0]._id.toHexString();
		let text = 'lalala', completed = true;

		request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({text,completed})
        .expect(404)
        .end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		let id = todos[1]._id.toHexString();
		let text = 'kokokoko', completed = false;

		request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({text,completed})
        .expect(200)
        .expect(res => {
            expect(res.body.updated.text).toBe(text);
            expect(res.body.updated.completed).toBe(false);
            expect(res.body.updated.completedAt).toBeFalsy();
        }).end(done);
	});
});


describe('Get /users/me', () => {
	it('should return user if authenticated success', (finish) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(finish);
	});

	it('should fail if status 401 and not authenticated',(done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('Post /users',() => {
	it('should create a user',done => {
		var email = 'ori@koki.com',
			password = 'orikokiko';

		request(app)
			.post('/users')
			.send({email,password})
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);            
			})
			.end((err) => {
				if(err) return done(err);

				User.findOne({email}).then(user => {
					expect(user.tokens[0].token).toBeTruthy();
					expect(user.password).not.toBe(password,':):):)');
					done();
				}).catch(e => {
					done(e);
				});
			});
	});
	it('should return validation error if request invalid',done => {
		var email = 'ori@ksss',
			password = '12345';

		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done);
	});
	it('should not create user if email in use',done => {
		var email = users[0].email,
			password = users[0].password

		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done);
	});
});

describe('Post /users/login', () => {
	it('should return user if credentials correct',(done) => {
		request(app)
			.post('/users/login')
			.send({
				email:users[1].email,
				password:users[1].password            
			})
			.expect(200)
			.expect(res => {
				expect(res.body.email).toBe(users[1].email);
				expect(res.header['x-auth']).toBeTruthy();
			})
			.end((err,res) => {
				if(err) return done(err);
				User.findOne({email:users[1].email}).then(user => {
					expect(user.tokens[1].token).toBe(res.header['x-auth']);
					done();
				}).catch(e => done(e));
			});
	});
	it('should reject invalid login',(done) => {
		var email = 'asdfas',
			password = '1234456';

		request(app)
			.post('/users/login')
			.send({email,password})
			.expect(400)
			.end(done);
	});
});


describe('Delete /users/logout', () => {
    it('should remove auth token when logout', (done) => {
        request(app)
        .delete('/users/logout')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((err,res) => {
            if(err) return done(err);

            User.findById(users[0]._id).then(user => {
                if(!user) return done('user wasn\'t found');
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(e => {
                done(e);
			});
			
        });
    });
});