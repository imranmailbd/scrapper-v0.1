const cheerio = require("cheerio");
const axios = require("axios");
const hpq = require('hpq');

const siteUrl = "https://www.marketbeat.com/stocks/directory/A/";

let siteRawData = "";
// const tags = new Set();
// const title = new Set();
// const link = new Set();
// const rating = new Set();

let scrapdata = [];


const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {
  const $ = await fetchData();


  //################################################
  //siteName = $('.top > .action-post-job').text();
  $("tr").each(function(i, element) {
      let scraprow = $(this)
        .prepend()
        .html();
      scrapdata.push(scraprow);

    });



   

  siteRawData = scrapdata;  //$('.PageTitleHOne').text();

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
  // $("div.nav p").each((index, element) => {
  //   categories.add($(element).text());
  // });
  // $('.company_and_position [itemprop="title"]').each((index, element) => {
  //   positions.add($(element).text());
  // });
  return {
    //positions: [...positions].sort(),
    //tags: [...tags].sort(),
    //title: [...title].sort(),
    //link: [...link].sort(),
    //categories: [...categories].sort(),
    siteRawData,
  };
};

module.exports = getResults;
