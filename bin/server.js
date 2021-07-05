const http = require('http');
const app = require('../app');
const { sequelize } = require('../models');

sequelize.sync({ alter: false })
  .then(() => {
    console.log('데이터베이스 연결 성공.');
  })
  .catch((error) => {
    console.error(error);
});

const PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행 중입니다.`)
});

