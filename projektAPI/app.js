var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var neobdelani_podatkiRouter = require('./routes/neobdelani_podatkiRoutes');
var obdelani_podatkiRouter = require('./routes/obdelani_podatkiRoutes');
var rezultatRouter = require('./routes/rezultatRoutes');
var scrapperRouter = require('./routes/scrapper_podatkiRoutes');

var app = express();
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://test:test@cluster0.to3tv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//var mongoDB = 'mongodb://127.0.0.1/Scrapper';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection failed'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/neobdelaniPodatki', neobdelani_podatkiRouter);
app.use('/obdelaniPodatki', obdelani_podatkiRouter);
app.use('/rezultat', rezultatRouter);
app.use('/scrapper', scrapperRouter);

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
