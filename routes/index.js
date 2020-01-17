const express = require("express");
const router = express.Router();
const getResults = require("../scrapper");
const getResultsApi = require("../scraperapi");
var http = require("http");
var createError = require('http-errors');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var uuidv4 = require('uuid/v4');
const cheerio = require("cheerio");
const axios = require("axios");
const hpq = require('hpq');

var bodyParser = require('body-parser');


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
  const result = await getResults('A');
  res.render("index", result);
  res.send('respond with a resource');
});


/* Old Scraper Method */
router.get("/scraperapiOld/(:dirname)", async function(req, res, next) { 

  var connection = mysql.createConnection(
	    {
	      host     : 'localhost',
	      user     : 'root',
	      password : 'test1234',
	      database : 'myapp',
	    }
	);
 
	connection.connect();

	var paramDir = req.params.dirname;

  const result = await getResultsApi(paramDir);
  
  const resultRows = result.siteRawData;

  var myData = [];

  resultRows.map(scraprow => {

  	var scrapStrObj = {};

  	const $ = cheerio.load(scraprow);
	
  	scrapStrObj.href = $('.no-underline').attr('href');
  	scrapStrObj.company_symbol_text = $('.ticker-area').text();
  	scrapStrObj.company_name = $('.title-area').text();

  	var str2 = String(scrapStrObj.href);
  	var res2 = str2.split("/");         
  	var market_symbol=res2[2];
  	var company_symbol=res2[3];
  	scrapStrObj.market_symbol = market_symbol;                 
  	scrapStrObj.company_symbol = company_symbol; 

  	var str = scraprow;
  	var res = str.split("</td>");                   
  	var rawbuy=res[3];
  	var rawsell=res[4]; 
  	rawbuy = String(rawbuy); 
  	rawsell = String(rawsell);                   

  	if ((rawbuy===null) || (rawbuy==='')){	
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


	const stock_scrap = {
            market_symbol: scrapStrObj.market_symbol, 
            company_symbol: scrapStrObj.company_symbol, 
            company_symbol_text: scrapStrObj.company_symbol_text, 
            href: scrapStrObj.href, 
            company_name: scrapStrObj.company_name, 
            consensus_rating: scrapStrObj.buy, 
            consensus_price_target: scrapStrObj.sell, 
            data_type: 'process', 
            created_at: date, 
            updated_at: ''
          }
	myData.push(stock_scrap);


  }); 

  var dataResponse = myData.splice(0, 1);

  const {status, resultRes, msg} = {status:200,resultRes:myData, msg:'successfully scrap'}; 

  let objectArrayScr = myData;
  //console.log(objectArrayScr);
  bulkInsertTest(connection, 'stock_scrap', objectArrayScr, (error, response) => {
    if (error) res.send(error);
    return res.end(JSON.stringify({status, resultRes, msg})); 
  });

  
  connection.end();
  //return res.end(JSON.stringify({status:404, resultRes:'', msg:'fail'}));


});



/* GET home page. */
router.get("/scraperapi/(:dirname)", async function(req, res, next) { 

//#####  getBreeds start #####
const getBreeds = async (dirP) => {
  try {
    //return axios.get('https://dog.ceo/api/breeds/list/all')
    //####################################################
    var connection = mysql.createConnection(
      {
        host     : 'localhost',
        user     : 'root',
        password : 'test1234',
        database : 'myapp',
      }
  );
 
  connection.connect();

  var paramDir = dirP;

  var numRows = null;

  let qryRes = [];
  
  //console.log("Dir Scrap Done:"+paramDir);

  const result = await getResultsApi(paramDir);
  //const resultRows = result.resultRes;
  //res.render("index", result);
  //res.send('respond with a resource');
  //console.log(result);

  const resultRows = result.siteRawData;

  var myData = [];

  resultRows.map(scraprow => {

    var scrapStrObj = {};

    const $ = cheerio.load(scraprow);
  
  scrapStrObj.href = $('.no-underline').attr('href');
  scrapStrObj.company_symbol_text = $('.ticker-area').text();
  scrapStrObj.company_name = $('.title-area').text();


  var str2 = String(scrapStrObj.href);
  var res2 = str2.split("/");
  //console.log(res2);                 
  var market_symbol=res2[2];
  var company_symbol=res2[3]; 
  // market_symbol = String(market_symbol); 
  // company_symbol = String(company_symbol);
  scrapStrObj.market_symbol = market_symbol;                 
  scrapStrObj.company_symbol = company_symbol; 

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


  const stock_scrap = {
            market_symbol: scrapStrObj.market_symbol, 
            company_symbol: scrapStrObj.company_symbol, 
            company_symbol_text: scrapStrObj.company_symbol_text, 
            href: scrapStrObj.href, 
            company_name: scrapStrObj.company_name, 
            consensus_rating: scrapStrObj.buy, 
            consensus_price_target: scrapStrObj.sell, 
            data_type: 'process', 
            created_at: date, 
            updated_at: ''
          }
  myData.push(stock_scrap);


  }); 

  var dataResponse = myData.splice(0, 1);

  const {status, resultRes, msg} = {status:200,resultRes:myData, msg:'successfully scrap'}; 

  let objectArrayScr = myData;
  //console.log(objectArrayScr);
  //console.log( Object.keys(objectArrayScr).length);
  let objLength =  Object.keys(objectArrayScr).length;
  let dataARows=0;



  const binst = bulkInsertTest(connection, 'stock_scrap', objectArrayScr, (error, response) => {
    if (error) res.send(error);
    
    //return res.end(JSON.stringify({status, resultRes, msg})); 

    //var numRows = results.affectedRows;
    //console.log(response.affectedRows);
    dataARows = response.affectedRows;
    //console.log(dataARows);

    //return dataARows;
    //res.sendStatus(201);
    //return res.end(JSON.stringify({status, resultRes, msg}));

    //global.qryRes = ['AB','CD','EF'];
    

  });

  // function getMessageId(connection){

  //     const query = "SELECT * FROM stock_config WHERE process_status = '1'";
      
  //     const promise = new Promise((resolve, reject,connection) => {
  //          connection.query(query, function(error, rows){
  //          var sql = rows[0];
  //          console.log(sql);
  //          resolve(sql.id);
  //       })
  //      return promise;
  //     });
  // }
  // getMessageId(connection).then((id) => console.log(id));

 //############################
  // var result2 = [];
  // var  getInformationFromDB = function(callback) {
  //   connection.query("SELECT * FROM stock_config WHERE process_status = '0'", function(err, res, fields)
  //   {
  //       if (err)  return callback(err);
  //        if(res.length){
  //       for(var i = 0; i<res.length; i++ ){     
  //                       result2.push(res[i]);
  //           }
  //        }
  //      callback(null, result2);
  //   });
  // };

  // console.log("Call Function");
  // const dataRes = getInformationFromDB(function (err, result) {
  //   // if (err) console.log("Database error!");
  //   else console.log(result2);
  //   //return result2;
  // });
  // console.log(dataRes);
  //###################################
//   let msgId;
//   function getMessageId(callback){
//     return connection.query("SELECT * FROM stock_config WHERE process_status = '0'", function(error, rows){
//         sql = rows[0];
//         console.log(sql);
//         callback(sql.id);
//     })
//   }

// function setMsgId(id) {
//   msgId = id;
//   console.log(msgId);
// }
// getMessageId(setMsgId);
//#########################

  // const sql = connection.format("SELECT * FROM stock_config WHERE process_status = ?", [1]);
  // console.log(sql);
  // const rows = await connection.query(sql);

  //console.log(rows);


  function bulkInsertTest(connection, table, objectArray, callback) {
 
    //############## old method working ok ##################
    // let keys = Object.keys(objectArray[0]);
    // let values = objectArray.map( obj => keys.map( key => obj[key]));
    // let sql = 'INSERT IGNORE INTO ' + table + ' (' + keys.join(',') + ') VALUES ? ';
    // var query = connection.query(sql, [values], function (err, results, fields) {
    //   if (err) console.log(err.code);
      
    //   callback(null, results);
    //   //console.log(results.affectedRows);
    //################ old method end ##########################

    // let keys = Object.keys(objectArray[0]);
    // let values = objectArray.map( obj => keys.map( key => obj[key]));
    // let sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ? ';
    // var query = connection.query(sql, [values], function (err, results, fields) {
    //   if (err) console.log(err.code);      
    //   callback(null, results);

    //});

    // let data = {market_symbol: req.body.market_symbol, company_symbol: req.body.company_symbol, status: req.body.status, created_at: req.body.created_at, updated_at: req.body.updated_at};
    // let sql = "INSERT INTO stock_parameter SET ?";
    // let query = connection.query(sql, data,(err, results) => {
    //   if(err) throw err;
    // });  

    //console.log(results.affectedRows);

      // market_symbol: scrapStrObj.market_symbol, 
      // company_symbol: scrapStrObj.company_symbol, 
      // company_symbol_text: scrapStrObj.company_symbol_text, 
      // href: scrapStrObj.href, 
      // company_name: scrapStrObj.company_name, 
      // consensus_rating: scrapStrObj.buy, 
      // consensus_price_target: scrapStrObj.sell, 
      // data_type: 'process', 
      // created_at: date, 
      // updated_at: ''

    let valuesObj = objectArray;

    //console.log(valuesObj);  

    valuesObj.map( valuesObj => {
                

      let data = {market_symbol: valuesObj.market_symbol, company_symbol: valuesObj.company_symbol, company_symbol_text: valuesObj.company_symbol_text, href: valuesObj.href, company_name: valuesObj.company_name, consensus_rating: valuesObj.consensus_rating, consensus_price_target: valuesObj.consensus_price_target, data_type: valuesObj.data_type, created_at: valuesObj.created_at, updated_at: valuesObj.updated_at};
      let sql = 'INSERT INTO ' + table + ' SET ? ON DUPLICATE KEY UPDATE consensus_rating = VALUES(consensus_rating), consensus_price_target = VALUES(consensus_price_target)';
      let query = connection.query(sql, data,(err, results) => {
        if (err) console.log(err.code);      
        //callback(null, results);
        //###########################
        var connection = mysql.createConnection(
            {
              host     : 'localhost',
              user     : 'root',
              password : 'test1234',
              database : 'myapp',
            }
        );
       
        connection.connect(); 

        if(results){                     

             //console.log("Data Updated......");
             connection.query("SELECT * FROM stock_parameter WHERE market_symbol = '"+valuesObj.market_symbol+"' AND company_symbol= '"+valuesObj.company_symbol+"' AND status = '1' ", function(error, rows){
         
                    // sql = rows[0];
                    // console.log(sql);
                    // callback(sql.id); 
                    if(rows){
                      if (rows.length === 1){
                        //console.log("Data Updated......");                            
                        var param = {
                            status: 1
                        };                                        
                        connection.query("UPDATE stock_scrap SET ? WHERE market_symbol = '"+valuesObj.market_symbol+"' AND company_symbol= '"+valuesObj.company_symbol+"'", param, function (error, results, fields) {
                         //if (error) throw error;
                         //res.end(JSON.stringify(results));
                        });
                      } 
                    }

                    // if (rows.length === 0){
                    //   console.log("Data Not Updated......");
                    // }
                });
             
        }
        connection.end();    
       


        //##########################


      });


    });   




  }


  return JSON.stringify({status:200, resultRes:objLength, msg:'OK', dirDone:paramDir}); 


  connection.end();

 

    //###################################################
  } catch (error) {
    console.error(error)
  }
}
//#####  getBreeds end #####

//#####  countBreeds start #####
const countBreeds = async (dirP) => {

//console.log("Dir Scrap Done:"+dirP);
  const breeds = getBreeds(dirP)
    .then(response => {
      //console.log(JSON.parse(response));
      var resObj = JSON.parse(response);

      if(resObj.resultRes > 0){
        
        //console.log(resObj.dirDone);


        //############################
        //~~~~~~~~~~~~~~~~~~~~~~~~~
        var connection = mysql.createConnection(
            {
              host     : 'localhost',
              user     : 'root',
              password : 'test1234',
              database : 'myapp',
            }
        ); 
        connection.connect();

        var objectArrayScr = [];

        connection.query('select * from stock_config where process_status=0', function (error, results, fields) {
      
          if (error) throw error;

          const config_info = results; 

          //######### Config Row Exist #########################

          if (config_info.length === 1){       
         
          var dirInfo = config_info[0].process_dir_data;
          var idInfo = config_info[0].id;

          //console.log(JSON.parse(dirInfo));          

          var undoneDirInfo = [];
          var doneDirInfo = [];

          var dirInfoParse = JSON.parse(dirInfo);
          var tmpStr = dirInfoParse[0];
          console.log(tmpStr);

          // var newStr = tmpStr.substring(1, tmpStr .length-1);
          // console.log(newStr);

          const object1 = tmpStr;

          // for (const [key, value] of Object.entries(object1)) {
          //   console.log(key);
          //   console.log(value);
          //  }


          
          Object.entries(object1).forEach(entry => {
              let key = entry[0];
              let value = entry[1];
              //console.log(key);
              if(value === 0){
                undoneDirInfo.push(key);
              }
              if(value === 1){
                doneDirInfo.push(key); 
              }
          });


          console.log(undoneDirInfo);
          console.log(doneDirInfo);

          let newArrayS = [];  
          newArrayS = resObj.dirDone;

          //.console.log("New Array:-----"+newArrayS);
          doneDirInfo.push(...newArrayS);
          doneDirInfo.sort();
          console.log(doneDirInfo.sort());


          //~~~~~~~~~~~~~~~~~~~
          var date;
          date = new Date();
          date = date.getUTCFullYear() + '-' +
              ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
              ('00' + date.getUTCDate()).slice(-2);

          var confArr = doneDirInfo;
          var myDataA = '[{';
          var config_item=null;
          var counterIndex = 0;
          var url_postfix = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
          for (let index = 0; index < url_postfix.length; index++) {
            
            if ( confArr.includes(url_postfix[index]) ){
                //console.log('Found');
                //var config_item = '"'+url_postfix[index]+'":'+1;
                var config_item = '"'+url_postfix[index]+'":'+1;
                if(url_postfix[index]!= "Z"){
                  config_item+=',';
                }

                counterIndex++;

            }
            if ( !confArr.includes(url_postfix[index]) ){
                //var config_item = '"'+url_postfix[index]+'":'+0;
                var config_item = '"'+url_postfix[index]+'":'+0;
                if(url_postfix[index]!= "Z"){
                  config_item+=',';
                }
            }

            //config_item = url_postfix[index];
            
            //myData.push(config_item);
            myDataA +=config_item;

          }
          myDataA +="}]";

          //console.log(myData);
          console.log(myDataA);


          

          //       console.log(dir_data);

          //if(resObj.dirDone === 'Z'){                      
          if(counterIndex === 26){  

            var dir_data = myDataA; 
            var param = {
                    process_dir_data: dir_data,
                    process_status: 1,
                    updated_at: date
            };

            connection.query('UPDATE stock_config SET ? where id='+idInfo, param, function (error, results, fields) {
                
                if (error) throw error;

                var date;
                date = new Date();
                date = date.getUTCFullYear() + '-' +
                    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
                    ('00' + date.getUTCDate()).slice(-2);

                var confArr = doneDirInfo;
                var myDataA = '[{';
                var config_item=null;
                var counterIndex = 0;
                var url_postfix = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                for (let index = 0; index < url_postfix.length; index++) {

                    //var config_item = '"'+url_postfix[index]+'":'+0;
                    var config_item = '"'+url_postfix[index]+'":'+0;
                    if(url_postfix[index]!= "Z"){
                      config_item+=',';
                    }

                  //config_item = url_postfix[index];
                  
                  //myData.push(config_item);
                  myDataA +=config_item;

                }
                myDataA +="}]";


                let data = {process_init_date: date, process_status: 0, process_dir_data:myDataA, created_at: date, updated_at: date};
                console.log(data);
                let sql = "INSERT INTO stock_config SET ?";
                let query = connection.query(sql, data,(err, results) => {
                if(err) throw err;
                  //res.end(JSON.stringify(results));
                }); 




             //res.end(JSON.stringify(results));
             //return JSON.stringify(results);
            });
          }

          if(counterIndex != 26){  

            var dir_data = myDataA; 
            var param = {
                    process_dir_data: dir_data,
                    updated_at: date
            };  

            connection.query('UPDATE stock_config SET ? where id='+idInfo, param, function (error, results, fields) {
             if (error) throw error;
             //res.end(JSON.stringify(results));
             return JSON.stringify(results);
            });
          }


          //~~~~~~~~~~~~~~~~~~~~~~

        }

        connection.end();
        //################ Config Row Exist End ######################

        //################## Config New Row Start ####################
      //   if (config_info.length === 0){

      //       var date;
      //       date = new Date();
      //       date = date.getUTCFullYear() + '-' +
      //           ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      //           ('00' + date.getUTCDate()).slice(-2);
      //           //  + ' ' + 
      //           // ('00' + date.getUTCHours()).slice(-2) + ':' + 
      //           // ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
      //           // ('00' + date.getUTCSeconds()).slice(-2);
      //       //console.log(date);

      //       var config_list = [];
      //       const dir_status = {
      //               A: 0, 
      //               B: 0, 
      //               C: 0, 
      //               D: 0, 
      //               E: 0, 
      //               F: 0, 
      //               G: 0, 
      //               H: 0, 
      //               I: 0, 
      //               J: 0
      //             }
      //       config_list.push(dir_status);

      //       var dir_data = JSON.stringify(config_list);

      //       let data = {process_init_date: date, process_status: 0, process_dir_data:dir_data, created_at: date, updated_at: date};
      //       console.log(data);
      //       let sql = "INSERT INTO stock_config SET ?";
      //       let query = connection.query(sql, data,(err, results) => {
      //       if(err) throw err;
      //       res.end(JSON.stringify(results));
      //       }); 

      //       // const {status, result, msg} = {status:200, result:config_info[0], msg:'incomplete process found'};
      //       // return res.end(JSON.stringify({status, result, msg}));   

      //       const {status, result, msg} = {status:200, result:JSON.stringify(config_list), msg:'new process created with current date'};
      //       return res.end(JSON.stringify({status, result, msg}));  
      // } 
      //################ Config New row End ##########################
        
          

        });
       
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //###########################
      }
    })
    .catch(error => {
      console.log("Dir Scrap Not Done");
      console.log(error)
    })
    
    


}
//#####  countBreeds end #####

var paramDir = req.params.dirname;

countBreeds(paramDir);

});
//######################################################
//#############################################################






/* GET home page. */
router.get("/scraper", async function(req, res, next) {

  var url_postfix = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

//setTimeout(function(){doSomethingElse();}, 500);
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
  //console.log(url_postfix[0]);
  for (let index = 0; index < url_postfix.length; index++) {

 //  	var connection = mysql.createConnection({
	//   host     : 'remotemysql.com',
	//   user     : 'DoXfd29drf',
	//   password : 'ASsCHoibhp',
	//   database : 'DoXfd29drf'
	// });

  var connection = mysql.createConnection(
	    {
	      host     : 'localhost',
	      user     : 'root',
	      password : 'test1234',
	      database : 'myapp',
	    }
	);
 
	connection.connect();

  const result = await getResults(url_postfix[index]);
  //const resultRows = result.resultRes;
  //res.render("index", result);
  //res.send('respond with a resource');

  const resultRows = result.siteRawData;

  var myData = [];

  resultRows.map(scraprow => {

  	var scrapStrObj = {};

  	const $ = cheerio.load(scraprow);
	
	scrapStrObj.href = $('.no-underline').attr('href');
	scrapStrObj.company_symbol_text = $('.ticker-area').text();
	scrapStrObj.company_name = $('.title-area').text();


	var str2 = String(scrapStrObj.href);
	var res2 = str2.split("/");
	//console.log(res2);                 
	var market_symbol=res2[2];
	var company_symbol=res2[3]; 
	// market_symbol = String(market_symbol); 
	// company_symbol = String(company_symbol);
	scrapStrObj.market_symbol = market_symbol;                 
	scrapStrObj.company_symbol = company_symbol; 

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
	//console.log(date);



	const stock_scrap = {
            market_symbol: scrapStrObj.market_symbol, 
            company_symbol: scrapStrObj.company_symbol, 
            company_symbol_text: scrapStrObj.company_symbol_text, 
            href: scrapStrObj.href, 
            company_name: scrapStrObj.company_name, 
            consensus_rating: scrapStrObj.buy, 
            consensus_price_target: scrapStrObj.sell, 
            created_at: date, 
            updated_at: ''
          }
	myData.push(stock_scrap);


	// tags = $('.ticker-area').text();
 //  	company_name = $('.title-area').text();


  // 		let $ = cheerio.load(scraprow);
		// let company_name = $('div[class="title_wrapper"] > h1').text().trim();
		// let consensus_rating = $('div[class="consensus_ratingValue"] > strong > span').text();
		// let consensus_ratingCount = $('div[class="imdbRating"] > a').text();
		// let data = {
		//     company_name,
		//     consensus_rating,
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
          //     company_symbol_text: hpq.query( '.ticker-area', hpq.text() ),
          //     company_name: hpq.query( '.title-area', hpq.text() ),

          // } );

          // scrapStrObj.src = mydata.src;
          // scrapStrObj.href = mydata.href;
          // scrapStrObj.company_symbol_text = mydata.company_symbol_text;
          // scrapStrObj.company_name = mydata.company_name;


  }); 


  var dataResponse = myData.splice(0, 1);

  const {status, resultRes, msg} = {status:200,resultRes:myData, msg:'successfully scrap'}; 

  let objectArrayScr = myData;
  //console.log(objectArrayScr);
  bulkInsertTest(connection, 'stock_scrap', objectArrayScr, (error, response) => {
    if (error) res.send(error);
    return res.end(JSON.stringify({status, resultRes, msg})); 
  });

  // if((url_postfix[index] === 'E' ) || (url_postfix[index] === 'J' ) || (url_postfix[index] === 'O' ) || (url_postfix[index] === 'S' ) ){
  //   await sleep(20000);
  //   console.log('sleeping....')
  // }

  connection.end();
  
  
  } 


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

// function bulkInsertTest(connection, table, objectArray, callback) {
 
//   let keys = Object.keys(objectArray[0]);
//   let values = objectArray.map( obj => keys.map( key => obj[key]));
//   let sql = 'INSERT IGNORE INTO ' + table + ' (' + keys.join(',') + ') VALUES ? ';
//   var query = connection.query(sql, [values], function (err, results, fields) {
//     if (err) console.log(err.code);
//     //console.log(results.affectedRows);
//     callback(null, results);

//   });


// }


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
  //console.log(req.body);

  var param = {
            market_symbol: req.body.market_symbol,
            company_symbol: req.body.company_symbol,
            status: req.body.status,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at
        };
              
  connection.query('UPDATE stock_parameter SET ? where id='+req.params.id, param, function (error, results, fields) {
   if (error) throw error;


   //###########################
    var connection = mysql.createConnection(
        {
          host     : 'localhost',
          user     : 'root',
          password : 'test1234',
          database : 'myapp',
        }
    );
   
    connection.connect(); 

    if(results){
            
          //console.log("Data Updated......");
          connection.query("SELECT * FROM stock_scrap WHERE market_symbol = '"+req.body.market_symbol+"' AND company_symbol= '"+req.body.company_symbol+"' ", function(error, rows){
       
              // sql = rows[0];
              // console.log(sql);
              // callback(sql.id); 
              if (rows.length === 1){
                //console.log("Data Updated......");                            
                var param = {
                    status: req.body.status
                };                                        
                connection.query("UPDATE stock_scrap SET ? WHERE market_symbol = '"+req.body.market_symbol+"' AND company_symbol= '"+req.body.company_symbol+"'", param, function (error, results, fields) {
                 //if (error) throw error;
                 //res.end(JSON.stringify(results));
                });
              } 

              // if (rows.length === 0){
              //   console.log("Data Not Updated......");
              // }
          });               
  
    }

    //####################################################


   res.end(JSON.stringify(results));


  });


});


router.delete('/stockParameterDelete/(:id)', function (req, res) {
  
 

   //###########################
    var connection = mysql.createConnection(
        {
          host     : 'localhost',
          user     : 'root',
          password : 'test1234',
          database : 'myapp',
        }
    );
   
    connection.connect(); 

    //###########################  ####  ###   ####   #######################
    connection.query('select id, id as edit_id, market_symbol, company_symbol, status from stock_parameter where id='+req.params.id, function (error, results, fields) {
     
      if(results){

        console.log(results);
              
            //console.log("Data Updated......");
            connection.query("SELECT * FROM stock_scrap WHERE market_symbol = '"+results.market_symbol+"' AND company_symbol= '"+results.company_symbol+"' ", function(error, rows){
         
                // sql = rows[0];
                // console.log(sql);
                // callback(sql.id); 
                if (rows.length === 1){
                  //console.log("Data Updated......");                            
                  var param = {
                      status: 0
                  };                                        
                  connection.query("UPDATE stock_scrap SET ? WHERE market_symbol = '"+results.market_symbol+"' AND company_symbol= '"+results.company_symbol+"'", param, function (error, results, fields) {
                   //if (error) throw error;
                   //res.end(JSON.stringify(results));
                  });
                } 

                // if (rows.length === 0){
                //   console.log("Data Not Updated......");
                // }
            });               
    
      }
    
  });
 
  //####################  ######  ###   #######################
  //####################################################

  //console.log(req.body);

  //var user = { id: req.params.id }
               
  connection.query('DELETE FROM stock_parameter where id='+req.params.id, function (error, results) {
   
   if (error) throw error;
   //res.end(JSON.stringify(results));

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
    
    //if(err) throw err;
    //callback(null, results);
    //###########################
    var connection = mysql.createConnection(
        {
          host     : 'localhost',
          user     : 'root',
          password : 'test1234',
          database : 'myapp',
        }
    );
   
    connection.connect(); 

    if(results){
            
          //console.log("Data Updated......");
          connection.query("SELECT * FROM stock_scrap WHERE market_symbol = '"+req.body.market_symbol+"' AND company_symbol= '"+req.body.company_symbol+"' ", function(error, rows){
       
              // sql = rows[0];
              // console.log(sql);
              // callback(sql.id); 
              if (rows.length === 1){
                //console.log("Data Updated......");                            
                var param = {
                    status: req.body.status
                };                                        
                connection.query("UPDATE stock_scrap SET ? WHERE market_symbol = '"+req.body.market_symbol+"' AND company_symbol= '"+req.body.company_symbol+"'", param, function (error, results, fields) {
                 //if (error) throw error;
                 //res.end(JSON.stringify(results));
                });
              } 

              // if (rows.length === 0){
              //   console.log("Data Not Updated......");
              // }
          });               
  
    }
        
   


    //##########################




  });

});




router.get('/api/config', function (req, res) {

  	connection.query('select * from stock_config where process_status=0', function (error, results, fields) {
	
	if (error) throw error;

	const config_info = results;
	  
	if (config_info.length === 1){

		//console.log(config_info[0].process_dir_data);  //process_dir_data
		const {status, rowid, result, msg} = {status:200, rowid:config_info[0].id, result:config_info[0].process_dir_data, msg:'incomplete process found'};
		return res.end(JSON.stringify({status, rowid, result, msg})); 


	} 

	if (config_info.length === 0){

		var date;
		date = new Date();
		date = date.getUTCFullYear() + '-' +
		    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
		    ('00' + date.getUTCDate()).slice(-2);
		    //  + ' ' + 
		    // ('00' + date.getUTCHours()).slice(-2) + ':' + 
		    // ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
		    // ('00' + date.getUTCSeconds()).slice(-2);
		//console.log(date);

		var config_list = [];
		const dir_status = {
            A: 0, 
            B: 0, 
            C: 0, 
            D: 0, 
            E: 0, 
            F: 0, 
            G: 0, 
            H: 0, 
            I: 0, 
            J: 0
          }
		config_list.push(dir_status);

		var dir_data = JSON.stringify(config_list);

		let data = {process_init_date: date, process_status: 0, process_dir_data:dir_data, created_at: date, updated_at: date};
		console.log(data);
		let sql = "INSERT INTO stock_config SET ?";
		let query = connection.query(sql, data,(err, results) => {
		if(err) throw err;
		res.end(JSON.stringify(results));
		});	

		// const {status, result, msg} = {status:200, result:config_info[0], msg:'incomplete process found'};
		// return res.end(JSON.stringify({status, result, msg})); 	

		const {status, result, msg} = {status:200, result:JSON.stringify(config_list), msg:'new process created with current date'};
		return res.end(JSON.stringify({status, result, msg}));  
	} 

    //res.end(JSON.stringify(results));

  });
});



router.post('/api/configUpdate/(:rowid)', function (req, res) {

  var date;
  date = new Date();
  date = date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2);

  var confArr = req.body;
  //console.log(confArr);
  //var myData = [];
  var myDataA = '[{';
  var config_item=null;
  var url_postfix = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  for (let index = 0; index < url_postfix.length; index++) {
    
    if ( confArr.includes(url_postfix[index]) ){
        console.log('Found');
        //var config_item = '"'+url_postfix[index]+'":'+1;
        var config_item = '"'+url_postfix[index]+'":'+1;
        if(url_postfix[index]){
          config_item+=',';
        }
    }
    if ( !confArr.includes(url_postfix[index]) ){
        //var config_item = '"'+url_postfix[index]+'":'+0;
        var config_item = '"'+url_postfix[index]+'":'+0;
        if(url_postfix[index]){
          config_item+=',';
        }
    }

    //config_item = url_postfix[index];
    
    //myData.push(config_item);
    myDataA +=config_item;

  }
  myDataA +="}]";

  //console.log(myData);
  //console.log(myDataA);

  // var arr = new Array(myData); 
  // arr.join(); 

  //console.log(arr);    

  //var config_list = [];
  // const dir_status = {};
  // dir_status = myDataA;
  //config_list.push(myDataA); 
  //console.log(myDataA);
   
  //console.log(dir_data);

  // //var dir_data = JSON.stringify(req.body);
  // //var dir_data = req.body;
  // //var dir_data = JSON.parse(req.body);
  var dir_data = myDataA; 
  var param = {
            process_dir_data: dir_data,
            updated_at: date
        };

  //       console.log(dir_data);
              
  connection.query('UPDATE stock_config SET ? where id='+req.params.rowid, param, function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
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



 


  
  //connection.query('INSERT INTO names SET name=?', "sameer", function(err, result) {
    
 
    //var log = result.insertId;
 
    // connection.query('INSERT INTO log SET logid=?', log, function(err, result) {
    //   if (err) { 
    //     connection.rollback(function() {
    //       throw err;
    //     });
    //   }  
    //   connection.commit(function(err) {
    //     if (err) { 
    //       connection.rollback(function() {
    //         throw err;
    //       });
    //     }
    //     console.log('Transaction Complete.');
    //     connection.end();
    //   });
    // });
  //});




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





 function bulkInsertTran(connection, table, objectArray, callback) {
  
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

  connection.beginTransaction(function(error) {
      if (error) { throw error; }
	  var query = connection.query(sql, [values], function (error, results, fields) {
	    if (error) console.log(err.code);
	    if (error) { 
	      connection.rollback(function() {
	        throw error;
	      });
	    }
	    //console.log(results.affectedRows);
	    callback(null, results);

	  });
  });

 } 


//Use for Scraping Data Insert
router.post('/api/scrapingDataInsert',(req, res) => {
  console.log(req);
  let data = {market_symbol: req.body.market_symbol, company_symbol: req.body.company_symbol, company_symbol_text: req.body.company_symbol_text, href: req.body.href, company_name: req.body.company_name, consensus_rating: req.body.consensus_rating, consensus_price_target: req.body.consensus_price_target, created_at: req.body.created_at, updated_at: req.body.updated_at};
  let sql = "INSERT INTO stock_scrap SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//###################  Database Model End ####################


//route for insert data
router.get('/api/scrapedData', function (req, res) {
   connection.query("SELECT id, market_symbol, company_symbol, company_name, consensus_price_target, consensus_rating, updated_at FROM stock_scrap WHERE status='1'", function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});





module.exports = router;

