var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 捕获登录状态
app.use(function (req,res,next) { // 进入路由之前优先进入function
  if(req.cookies.userId){ // 有cookies,说明已经登录
    next();
  }else{
      console.log("url:"+req.path);
      // 未登录时可以点击登录login登出logout和查看商品列表
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path == '/goods/list'){
          next();
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
          });
      }
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goods)

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
