"use strict";

const express = require('express');
const app = express();
const signctrl = require('../controller/signCtrl');

app.use('/explore', require('./explore'));

app.use('/collect', require('./collect'));

app.use('/profile', require('./profile'));

app.use('/category', require('./category'));

app.use('/bookmark', require('./bookmark'));
app.use('/bookmarks', require('./bookmark'));

app.use('/auth', require('./auth'));


// app.get('/logout', signctrl.logout);
// app.post('/login', signctrl.login);
// app.post('/signup', signctrl.signup);

module.exports = app;