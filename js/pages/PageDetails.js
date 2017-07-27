'use strict';

const utils = require('./Utils.js')
const AFTER_NEXT_SLEEP = 500;

const scraper = require('../scrapers/DetailsScraper.js');

const selectors = {
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
};

module.exports = {
  init : () => {
    return utils.loadScraper(scraper);
  },
  next: () => {
    return waitAndClick(selectors.BUTTON_NEXT_SUMMARY)
      .then(utils.waitPageLoaded)
      .then(this.init);
  }
}
