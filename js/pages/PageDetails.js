'use strict';

const utils = require('./Utils.js')
const scraper = require('../scrapers/DetailsScraper.js');

const selectors = {
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current',
  BUTTON_SUMMARY_TAB: '#ButtonViewSummary'
};

const detailsPage = {
  init: () => {
    return waitAndClick(selectors.BUTTON_SUMMARY_TAB)
      .then(utils.waitPageLoaded).then(() => utils.loadScraper(scraper));
  },
  next: () => {
    return waitAndClick(selectors.BUTTON_NEXT_SUMMARY)
      .then(utils.waitPageLoaded)
      .then(this.init)
  },
  getStatus: () => {
    return element.all(by.css(selectors.LABEL_PAGE_STATUS)).first().getText()
      .then((text) => text.replace(',', '').split('/').map((s) => parseInt(s)));
  },
  scrapeAll: scrapeAll,
  scrape: (url) => browser.get(url).then(this.init).then(utils.scrape)
}

function scrapeAll() {
  return detailsPage.init().then(() => utils.scrapeAll(detailsPage)); //TODO: Use this.
}

module.exports = detailsPage;
