const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { User, sequelize } = require('../models');
const handlebars = require('handlebars');
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.google.com',
  port: 587,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    accessToken: process.env.GMAIL_ACCESS_TOKEN,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN
  },
});

cron.schedule('20 20 * * 6', async() => {
  const templateStr = fs.readFileSync(path.resolve('./view', 'notification-template.html')).toString('utf8');
  const users = await User.findAll({
    attributes:['id', 'username', 'email']
  }).then((result) => result.map((user) => user.dataValues));
  console.log(users);
  const sql = `SELECT COUNT(id) AS count, userId FROM Bookmarks WHERE visitCounts = 0 AND NOW() - createdAt >= 7 GROUP BY userId;`;
  const results = await sequelize.query(sql);
  console.log(results);
  let lists = results[0].map((el) => {
    for(let idx in users) {
      if(users[idx].id === el.userId) {
        el.email = users[idx].email;
        el.username = users[idx].username;
      }
    }
    return el;
  });
  try {
    for(let i = 0; i < lists.length; i++) {
    let template = handlebars.compile(templateStr, { noEscape: true });
    let data = { username:'', count:'', email: '' };
    data.username = lists[i].username;
    data.count = lists[i].count;
    let htmlToSend = template(data);
    console.log('-----------확인------------------');
    let message = {
      from: process.env.GMAIL_USER,
      to: lists[i].email,
      subject:'Recollect에 아직 읽지 않은 북마크가 있습니다',
      html: htmlToSend,
    }
    transporter.sendMail(message, (err, info) => {
      if(err) {
        console.error(err);
        throw Error;
      } else {
        console.log('-------------------알림 메일을 전송하였습니다------------------', info);
      }
    });
  } 
} catch(err) {
  next(new Error('failed'));
  }
});

app.listen(4000, () => {
  console.log('cron 작업을 위한 포트 4000번 실행 중 입니다.');
});

//* SIGTERM && SIGINT 처리
process.on('SIGINT', (err,req,res,next) => {
  process.exit(err ? 1 : 0);
});

//* 예상치 못한 예외 처리
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생 : ' + err);
});

module.exports = app;
