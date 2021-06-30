const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const signRouter = require('./routes/sign');
const collectRouter = require('./routes/collect');
const exploreRouter = require('./routes/explore');
const profileRouter = require('./routes/profile');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(logger('dev'));
//app.use(logger('combined')) 배포 시에 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form data submit할때 form parsing, true면 qs false면 queryString
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', signRouter);
app.use('/collect', collectRouter);
app.use('/explore', exploreRouter);
app.use('/profile', profileRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
