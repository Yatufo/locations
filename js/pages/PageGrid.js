'use strict';

const utils = require('./Utils.js')
const scraper = require('../scrapers/GridScraper.js');

module.exports = {
  init: () => {
    return utils.waitPageLoaded()
    .then(() => {
      return utils.loadScraper(scraper);
    });
  }
}
