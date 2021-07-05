const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /signup', () => {
  test('회원이 아닌 경우', (done) => {
    request(app)
        .post('/signup')
        .send({
          email: 'honghwa0324@gmail.com',
          username: 'honghwa0324',
          pwd: '9350Park!',
        })
        .expect(200)
        .end(done)
  });
  test('이미 회원인 경우', (done) => {
    request(app)
        .post('/signup')
        .send({
          email:'honghwa0324@gmail.com',
          username: 'honghwa0324',
          pwd: '9350Park!'
        })
        .expect(409)
        .end(done)
  });
});

describe('POST /login', () => {
  test('로그인 실행', (done) => {
    request(app)
        .post('/login')
        .send({
          email: 'honghwa0324@gmail.com',
          pwd: '9350park!',
        })
        .expect(401)
        .end(done)
  });
});

describe('POST /logout', () => {

  test('로그인 되어 있지 않은 경우', (done) => {
    request(app)
        .get('/logout')
        .expect(401)
        .end(done)
  });

  const agent = request(app);
  beforeEach((done) => {
    agent
        .post('/login')
        .send({
          email: 'honghwa0324@gmail.com',
          password: '9350park!',
        })
        .end(done);
  });

  test('로그아웃 수행', (done) => {
    agent 
        .get('/logout')
        .expect(200)
        .end(done)
  })

});

// describe('POST /login/pwd/forgot', () => {

// });

// describe('POST /login/pwd/reset', () => {

// });

afterAll(async() => {
  await sequelize.sync({ force: true });
})