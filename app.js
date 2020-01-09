var http = require("http");
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

var mysql      = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
//var multer = require('multer');
//var mongoose = require('mongoose');
var uuidv4 = require('uuid/v4');
var router = express.Router();
var bodyParser = require('body-parser');


app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))




app.use(cors())
const secret = 'mysecretsshhh';
//For File Upload
const DIR = './public/';

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'test1234',
//   database : 'myapp'
// });
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'DoXfd29drf',
  password : 'ASsCHoibhp',
  database : 'DoXfd29drf'
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})  


// var server = app.listen(3005, "127.0.0.1", function () {
//   var host = server.address().address
//   var port = server.address().port 
//   console.log("Example app listening at http://%s:%s", host, port)
// });



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);

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

// const port = 9000
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))