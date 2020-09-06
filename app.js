var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var digRouter = require('./routes/digs');

var app = express();

//Set up mongoose connection
// u: una
// pw: ljosaland

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://una:ljosaland@icearch.8irqv.azure.mongodb.net/icedig?retryWrites=true';
// &w=majority
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/digs', digRouter);
// app.use('/dig', digRouter);
app.use('/users', usersRouter);

module.exports = app;
