'use strict';

const utils = require('./Utils.js')
const scraper = require('../scrapers/DetailsScraper.js');
const pageDetails = {
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  scrape: (url) => browser.get(url).then(pageDetails.init).then(utils.scrape)
}
module.exports = pageDetails;
