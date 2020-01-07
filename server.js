var http = require("http");
var express = require('express');
var cors = require('cors');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var multer = require('multer');
//var mongoose = require('mongoose');
var uuidv4 = require('uuid/v4');
var router = express.Router();

app.use(cors())

const secret = 'mysecretsshhh';

//For File Upload
const DIR = './public/';

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'myapp'
});


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});



connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
  
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var server = app.listen(3005, "127.0.0.1", function () {
  var host = server.address().address
  var port = server.address().port 
  console.log("Example app listening at http://%s:%s", host, port)
});

//route for insert data
app.post('/',(req, res) => {
	//console.log(req);
  let data = {market_name: req.body.market_name, company_name: req.body.company_name, company_name_text: req.body.company_name_text, href: req.body.href, title: req.body.title, rating: req.body.rating, pricetarget: req.body.pricetarget, created_at: req.body.created_at, updated_at: req.body.updated_at};
  let sql = "INSERT INTO scraped_data SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});


//route for insert data
app.get('/', function (req, res) {
   connection.query('select id,market_name,company_name,pricetarget,title,created_at from scraped_data', function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});

//route for insert data
app.get('/stockParameterRead', function (req, res) {
  connection.query('select id, id as edit_id, market_symbol, company_symbol, status from stock_parameter', function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
  });
});

app.get('/stockParameterEditRead/(:id)', function (req, res) {
  connection.query('select id, id as edit_id, market_symbol, company_symbol, status from stock_parameter where id='+req.params.id, function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
  });
});

app.post('/stockParameterEdit/(:id)', function (req, res) {
  // var param = {
  //           market_symbol: req.sanitize('market_symbol').escape().trim(),
  //           company_symbol: req.sanitize('company_symbol').escape().trim(),
  //           status: req.sanitize('status').escape().trim(),
  //           created_at: req.sanitize('created_at').escape().trim(),
  //           updated_at: req.sanitize('updated_at').escape().trim()
  //       }
  console.log(req.body);

  var param = {
            market_symbol: req.body.market_symbol,
            company_symbol: req.body.company_symbol,
            status: req.body.status,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at
        };
              
  connection.query('UPDATE stock_parameter SET ? where id='+req.params.id, param, function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
  });
});


app.delete('/stockParameterDelete/(:id)', function (req, res) {
  
  //console.log(req.body);

  //var user = { id: req.params.id }
               
  connection.query('DELETE FROM stock_parameter where id='+req.params.id, function (error, results) {
   if (error) throw error;
   res.end(JSON.stringify(results));

  //  if (err) {
  //     req.flash('error', err)
  //     // redirect to users list page
  //     res.redirect('/users')
  // } else {
  //     req.flash('success', 'User deleted successfully! id = ' + req.params.id)
  //     // redirect to users list page
  //     res.redirect('/users')
  // }

  });

});



app.post('/stockParameterInsert', function (req, res) {
  // connection.query('select id market_symbol, company_symbol, status from stock_parameter', function (error, results, fields) {
  //  if (error) throw error;
  //  res.end(JSON.stringify(results));
  // });

  let data = {market_symbol: req.body.market_symbol, company_symbol: req.body.company_symbol, status: req.body.status, created_at: req.body.created_at, updated_at: req.body.updated_at};
  let sql = "INSERT INTO stock_parameter SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
  });

});



// POST route to register a user
app.post('/api/register', function(req, res) {
  // const name = req.body.name; 
  // const password = req.body.password;
  // const email = req.body.email;

  let data = {name: req.body.name, password: req.body.password, email: req.body.email, status: 1, created_at: req.body.created_at, updated_at: req.body.updated_at};
  let sql = "INSERT INTO user SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.end(JSON.stringify(results));
  });
  
  // user.save(function(err) {
  //   if (err) {
  //     res.status(500)
  //       .send("Error registering new user please try again.");
  //   } else {
  //     res.status(200).send("Welcome to the club!");
  //   }
  // });

});

app.post('/api/login', function (req, res) {
  
  //console.log(req.body);
  //const {title, description} = req.body;{email:'test@gmail.com', password:'123456'}
  var email = req.body.email;
  var password = req.body.password;

  const {status, result} = {status:'400',result:''};
              
  connection.query('SELECT id, email, avatar, password, name FROM user where email="'+email+'" AND password="'+password+'"', function (error, results) {

      //console.log(results);
      //if (error) throw error;

      const user_info = results;
      
      if (user_info.length === 1){
        const {status, result} = {status:200, result:user_info[0], msg:'user match'};
        return res.end(JSON.stringify({status, result})); 
      } 

      if (user_info.length === 0){
        const {status, error_data} = {status:404,error_data:{msg:'No user found according to the provided data. Please enter right information'}};
        return res.end(JSON.stringify({status, error_data}));  
      } 
  
  });

});


app.post('/api/stockParameterInsertCsv', function (req, res) {

  //console.log(req.body);  
  
  let objectArray = req.body;
  console.log(objectArray);
  bulkInsert(connection, 'stock_parameter', objectArray, (error, response) => {
    if (error) res.send(error);
    res.json(response);
  });

});


function bulkInsert(connection, table, objectArray, callback) {
  
  // let keys = Object.keys(objectArray[0]);
  // let values = objectArray.map( obj => keys.map( key => obj[key]));
  // let sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ? ';
  // connection.query(sql, [values], function (error, results, fields) {
  //   if (error) callback(error);
  //   callback(null, results);
  // });

  // connection.query('INSERT IGNORE INTO ' + table + ' (market_symbol, company_symbol) VALUES ?',
  //     [objectArray.map(item => [item.market_symbol, item.company_symbol])],
  //     (error, results) => {
  //         if (error) callback(error);
  //         callback(null, results);
  //     }
  // );

  let keys = Object.keys(objectArray[0]);
  let values = objectArray.map( obj => keys.map( key => obj[key]));
  let sql = 'INSERT IGNORE INTO ' + table + ' (' + keys.join(',') + ') VALUES ? ';
  var query = connection.query(sql, [values], function (error, results, fields) {
    if (error) console.log(err.code);
    //console.log(results.affectedRows);
    callback(null, results);

  });



// var query = connection.query({
//     sql: queryString,
//     timeout: 10000,
// }, filter );

// query
//   .on('error', function(err) {
//    if (err) {
//       console.log(err.code);
//       // Do anything you want whenever there is an error.
//       // throw err;
//    } 
// })
// .on('result', function(row) {
//   //Do something with your result.
// })
// .on('end', function() {
//   //connection.release();
// });


}


//Use for Scraping Data Insert
app.post('/api/scrapingDataInsert',(req, res) => {
  console.log(req);
  let data = {market_name: req.body.market_name, company_name: req.body.company_name, company_name_text: req.body.company_name_text, href: req.body.href, title: req.body.title, rating: req.body.rating, pricetarget: req.body.pricetarget, created_at: req.body.created_at, updated_at: req.body.updated_at};
  let sql = "INSERT INTO scraped_data SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});




