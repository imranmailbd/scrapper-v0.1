const cheerio = require("cheerio");
const axios = require("axios");
const hpq = require('hpq');

const siteUrl = "https://www.marketbeat.com/stocks/directory/";

let siteRawData = "";
const tags = new Set();
const company_name = new Set();
const link = new Set();
//const rating = new Set();

let scrapdata = [];


const fetchData = async (postfx) => {
  //console.log('this is:');
  //console.log(siteUrl+postfx);
  const result = await axios.get(siteUrl+postfx);
  return cheerio.load(result.data);
};

const getResults = async (url_postfix) => {

  //console.log(url_postfix);
  const postfx = url_postfix;

  const $ = await fetchData(postfx);


  //################################################
  //siteName = $('.top > .action-post-job').text();
  $("tr").each(function(i, element) {
      let scraprow = $(this)
        .prepend()
        .html();
      scrapdata.push(scraprow);

    });



   

  siteRawData = scrapdata;  //$('.PageTitleHOne').text();

  $(".ticker-area").each((index, element) => {
    tags.add($(element).text());
  });
  $(".title-area").each((index, element) => {
    company_name.add($(element).text());
  });
  //$(this).attr('href');
  $(".no-underline").each((index, element) => {
    link.add($(element).attr('href'));
  });
  // $("div.nav p").each((index, element) => {
  //   categories.add($(element).text());
  // });
  // $('.company_and_position [itemprop="company_name"]').each((index, element) => {
  //   positions.add($(element).text());
  // });
  return {
    //positions: [...positions].sort(),
    tags: [...tags].sort(),
    company_name: [...company_name].sort(),
    link: [...link].sort(),
    //categories: [...categories].sort(),
  };
};

module.exports = getResults;
