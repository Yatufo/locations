'use strict';

const utils = require('./Utils.js')
const AFTER_NEXT_SLEEP = 500;

const scraper = require('../scrapers/DetailsScraper.js');

const selectors = {
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
};

const next = function() {
  return waitAndClick(element.all(by.css(selectors.BUTTON_NEXT_SUMMARY)).first())
    .then(() => {
      return browser.driver.sleep(AFTER_NEXT_SLEEP); // waits so the ajax call has time to come back.
    });
}

module.exports = {
  next: next,
  init : () => {
    return utils.loadScraper(scraper);
  }
}
