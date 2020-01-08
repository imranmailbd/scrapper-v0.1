const express = require("express");
const router = express.Router();
const getResults = require("../scrapper");

//New
var http = require("http");
var createError = require('http-errors');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
//var multer = require('multer');
//var mongoose = require('mongoose');
var uuidv4 = require('uuid/v4');

const cheerio = require("cheerio");
const axios = require("axios");
const hpq = require('hpq');




//New
//app.use(cors());
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'myapp'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})  



/* GET home page. */
router.get("/", async function(req, res, next) {
  const result = await getResults();
  res.render("index", result);
  res.send('respond with a resource');
});



/* GET home page. */
router.get("/scraper", async function(req, res, next) {

  const result = await getResults();
  //const resultRows = result.resultRes;
  //res.render("index", result);
  //res.send('respond with a resource');

  const resultRows = result.siteRawData;

  var myData = [];

  resultRows.map(scraprow => {

  	var scrapStrObj = {};

  	const $ = cheerio.load(scraprow);
	
	scrapStrObj.href = $('.no-underline').attr('href');
	scrapStrObj.company_name_text = $('.ticker-area').text();
	scrapStrObj.title = $('.title-area').text();


	var str2 = String(scrapStrObj.href);
	var res2 = str2.split("/");
	//console.log(res2);                 
	var market_name=res2[2];
	var company_name=res2[3]; 
	// market_name = String(market_name); 
	// company_name = String(company_name);
	scrapStrObj.market_name = market_name;                 
	scrapStrObj.company_name = company_name; 

	var str = scraprow;
	var res = str.split("</td>");                   
	var rawbuy=res[3];
	var rawsell=res[4]; 
	rawbuy = String(rawbuy); 
	rawsell = String(rawsell);                   

	if ((rawbuy===null) || (rawbuy==='')){
	//console.log('none');
	scrapStrObj.buy = null; 
	} 

	if ((rawbuy!==null) || (rawbuy!=='')){
	  const stripHtml = require("string-strip-html");
	  //console.log(stripHtml(rawbuy));  
	  scrapStrObj.buy = stripHtml(rawbuy);                    
	}

	if ((rawsell===null) || (rawsell==='')){
	  //console.log('none');
	  scrapStrObj.sell = null; 
	} 

	if ((rawsell!==null) || (rawsell!=='')){
	  const stripHtml = require("string-strip-html");
	  //console.log(stripHtml(rawsell));  
	  scrapStrObj.sell = stripHtml(rawsell);
	} 


	var date;
	date = new Date();
	date = date.getUTCFullYear() + '-' +
	    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
	    ('00' + date.getUTCDate()).slice(-2);
	    //  + ' ' + 
	    // ('00' + date.getUTCHours()).slice(-2) + ':' + 
	    // ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
	    // ('00' + date.getUTCSeconds()).slice(-2);
	console.log(date);



	const scraped_data = {
            market_name: scrapStrObj.market_name, 
            company_name: scrapStrObj.company_name, 
            company_name_text: scrapStrObj.company_name_text, 
            href: scrapStrObj.href, 
            title: scrapStrObj.title, 
            rating: scrapStrObj.buy, 
            pricetarget: scrapStrObj.sell, 
            created_at: date, 
            updated_at: ''
          }
	myData.push(scraped_data);


	// tags = $('.ticker-area').text();
 //  	title = $('.title-area').text();


  // 		let $ = cheerio.load(scraprow);
		// let title = $('div[class="title_wrapper"] > h1').text().trim();
		// let rating = $('div[class="ratingValue"] > strong > span').text();
		// let ratingCount = $('div[class="imdbRating"] > a').text();
		// let data = {
		//     title,
		//     rating,
		//     ratingCount
		// };

		// $('.apple', '#fruits').text()

		// $(".ticker-area").each((index, element) => {
		//   tags.add($(element).text());
		// });
		// $(".title-area").each((index, element) => {
		//   title.add($(element).text());
		// });
		// //$(this).attr('href');
		// $(".no-underline").each((index, element) => {
		//   link.add($(element).attr('href'));
		// });





          // var scrapStrObj = {};
                             
          // //######## DOM Parse Machanism ########
          // const hpq = require('hpq');
          // const mydata = hpq.parse( scraprow, {
          //     src: hpq.attr( 'img', 'src' ),
          //     href: hpq.attr( 'a', 'href' ),
          //     company_name_text: hpq.query( '.ticker-area', hpq.text() ),
          //     title: hpq.query( '.title-area', hpq.text() ),

          // } );

          // scrapStrObj.src = mydata.src;
          // scrapStrObj.href = mydata.href;
          // scrapStrObj.company_name_text = mydata.company_name_text;
          // scrapStrObj.title = mydata.title;


  }); 

  var dataResponse = myData.splice(0, 1);

  const {status, resultRes, msg} = {status:200,resultRes:myData, msg:'successfully scrap'}; 

  let objectArrayScr = myData;
  //console.log(objectArrayScr);
  bulkInsert(connection, 'scraped_data', objectArrayScr, (error, response) => {
    if (error) res.send(error);
    return res.end(JSON.stringify({status, resultRes, msg})); 
  });
   


  //user_info[0]
   

  //console.log(req.body);
  //var email = req.body.email;
  //var password = req.body.password;
  //const {status, result} = {status:'400',result:''};              
  //connection.query('SELECT id, email, avatar, password, name FROM user where email="'+email+'" AND password="'+password+'"', function (error, results) {

		//console.log(results);
		//if (error) throw error;

		//const user_info = results;

		// if (user_info.length === 1){
		// const {status, result} = {status:200, result:user_info[0], msg:'user match'};
		// return res.end(JSON.stringify({status, result})); 
		// } 

		// if (user_info.length === 0){
		// const {status, error_data} = {status:404,error_data:{msg:'No user found according to the provided data. Please enter right information'}};
		// return res.end(JSON.stringify({status, error_data}));  
		//} 
  
  //});


});


//###################  Database Model Start ####################
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//route for insert data
router.get('/stockParameterRead', function (req, res) {
  connection.query('select id, id as edit_id, market_symbol, company_symbol, status from stock_parameter', function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
  });
});


router.get('/stockParameterEditRead/(:id)', function (req, res) {
  connection.query('select id, id as edit_id, market_symbol, company_symbol, status from stock_parameter where id='+req.params.id, function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
  });
});

router.post('/stockParameterEdit/(:id)', function (req, res) {
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


router.delete('/stockParameterDelete/(:id)', function (req, res) {
  
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



router.post('/stockParameterInsert', function (req, res) {
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
router.post('/api/register', function(req, res) {
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

router.post('/api/login', function (req, res) {
  
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


router.post('/api/stockParameterInsertCsv', function (req, res) {

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
router.post('/api/scrapingDataInsert',(req, res) => {
  console.log(req);
  let data = {market_name: req.body.market_name, company_name: req.body.company_name, company_name_text: req.body.company_name_text, href: req.body.href, title: req.body.title, rating: req.body.rating, pricetarget: req.body.pricetarget, created_at: req.body.created_at, updated_at: req.body.updated_at};
  let sql = "INSERT INTO scraped_data SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//###################  Database Model End ####################


//route for insert data
router.get('/api/scrapedData', function (req, res) {
   connection.query('select id,market_name,company_name,pricetarget,title,created_at from scraped_data', function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});





module.exports = router;

