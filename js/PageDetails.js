'use strict';

const AFTER_NEXT_SLEEP = 500;

const detailsScraper = require('./scrapers/DetailsScraper.js');

const loadScraper = function() {
  return browser.executeScript(() => {
      $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
      window.scrapeDetails = eval(arguments[0]);
    }, detailsScraper.toString())
    .then(() => {
      return browser.driver.sleep(3000);
    });
}

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

const scrape = function() {
  return browser.executeScript("return scrapeDetails();");
}

module.exports = {
  loadScraper: loadScraper,
  selectors: selectors,
  scrape: scrape,
  next: next
}
