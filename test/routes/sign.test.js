const { signUpController, logInController, forgotPwdController, resetPwdController, logOutController, refreshTokenController } = require('../../controllers/signController');
const request = require('supertest');

describe('POST /login', () => {
  //TODO: 로그인 성공
  it('login success', (done) => {
    request(app)
        .post({
          email: 'justicexx0099@gmail.com',
          pwd: '9350Park!'
        })
        .expect(200, done);
  });
  //TODO: 로그인 실패
  it('login failed with wrong password', (done) => {
    request(app)
        .post({
          email: 'justicexx0099@gmail.com'
        })
        .expect(422, done);
  });
  it('not our user', () => {
    request(app)
        .post({
          email: 'justicexx@gmail.com',
          pwd: '9350park!'
        })
        .expect(401, done);
  });
})