"use strict";

const express = require('express');
const app = express();

app.use('/explore', require('./explore'));

app.use('/collect', require('./collect'));

app.use('/profile', require('./profile'));

app.use('/category', require('./category'));
app.use('/bookmark', require('./bookmark'));
app.use('/bookmarks', require('./bookmark'));

app.use('/auth', require('./auth'));
app.use('/login', require('./sign'));
app.use('/logout', require('./sign'));
app.use('/signup', require('./sign'));


module.exports = app;