var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var parseurl = require('parseurl');


var routes = require('./routes/index');
var db = mongoose.connect("mongodb://localhost/microblog");
var app = express();
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(function(req, res, next) {
  res.locals.ua = req.get('User-Agent');
  next();
});
// Session
app.use(session({ 
  secret: 'microblog', 
  cookie: { 
    maxAge: 1000*60*60*24*7
  }
}));
app.use(session({
  secret: 'microblog',
  resave: false,
  saveUninitialized: true
}));
//Cookie
app.use(cookieParser());
app.use(function (req, res, next) {
  var views = req.session.views
  if (!views) {
    views = req.session.views = {}
  }
 
  // get the url pathname 
  var pathname = parseurl(req).pathname
 
  // count the views 
  views[pathname] = (views[pathname] || 0) + 1
 
  next()
})

// Routers
app.use('/', routes);

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//app.listen('3000');
module.exports = app;
