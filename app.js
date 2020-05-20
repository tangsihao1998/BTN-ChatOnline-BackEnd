const createError = require('http-errors');
const express = require('express');
var path = require('path');
const cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Define Routes Here -------------------------------------------
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// Api Router
// --------------------------------------------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose connection -----------------------------------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/local',{ useNewUrlParser: true });

var db=mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//---------------------------------------------------------------------------------------------------------

// Passport
app.use(passport.initialize());
require('./routes/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//------------------ Define a Route --------------------------
app.use('/', indexRouter);
app.use('/users', usersRouter);
//------------------------------------------------------------

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

//----------------------------------------------------------------------------------------------------------


module.exports = app;
