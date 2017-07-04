const sandcrawler = require('sandcrawler');
const spider = sandcrawler.spider('RealStateSpider');

spider
.url('http://www.centris.ca/')
.before((next) => {
  console.log("Before");
  next();
})
.scraper(($, done) => {
  done(null, $('.yummy-data').scrape());
})
.result((err, req, res) => {
  console.log('Yummy data!', res.data);
})
.run((err, remains) => {
  console.log('Finished!');
});
