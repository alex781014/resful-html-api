var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const serveIndex = require('serve-index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(serveIndex('public', { 'icons': true }));




// app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/try-sse', (req, res) => {   //9.SSE Server Sent Event  用get就好
  let id = 30;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=UTF-8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  setInterval(function () { //用setInterval 設定一秒傳資料到前端 內容是用res.write()只能用write!!
    const now = new Date();
    res.write(`id: ${id}\n`)//只能用res.write !write本身不會換行
    res.write(`data: ${now.toString()}\n\n`)//只能用res.write !write本身不會換行
    id++;
  }, 1000)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
