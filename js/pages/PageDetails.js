'use strict';

const utils = require('./Utils.js')
const scraper = require('../scrapers/DetailsScraper.js');

module.exports = {
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  scrape: (url) => browser.get(url).then(this.init).then(utils.scrape)
}
