const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const hpp =require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const app = express();
const routes = require('./routes/index');

dotenv.config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

dotenv.config();

//* 세션 옵션 설정
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.REFRESH_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 6 * 60 * 10000,
  },
  store: new RedisStore({ client: redisClient }),
};

//* 배포 환경 설정 
if( process.env.NODE_ENV === 'production' ) {
  console.log('배포환경 입니다.');
  app.enable('trust proxy');
  app.use((req,res,next) => {
    res.setHeader('X-Powered-By','');
    next();
  });
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
  app.disable("x-powered-by");
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session(sessionOption));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  exposeHeaders: ['*','Authorization']
  }));

//* 라우팅
app.use('/',routes);

//* 예상치 못한 예외 처리
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생 : ' + err);
});

//* 에러 처리 미들웨어 
app.use(function(err, req, res, next) {
  console.error('--------',err.message,'---------');
  res.status(500).send({ message: 'failed'});
});


module.exports = app;
