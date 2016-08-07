var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var MongoStore = require('connect-mongo')(express);
// var flash = require('connect-flash');

//mongoose
//mongoose.connect('mongodb://localhost/learnlive');

var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
var mall = require('./routes/mall');
var tools = require('./routes/tools');
var copy = require('./routes/copy');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',require('ejs').__express);  //app.engine('.html',require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.use('/article',article);
app.use('/mall',mall);
app.use('/tools',tools);
app.use('/copy', copy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if(err.status == 404){
      res.render('404', {title:'404'});
    }else{
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}else{
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}


module.exports = app;
