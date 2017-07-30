'use strict';

const utils = require('./Utils.js')
const scraper = require('../scrapers/GridScraper.js');

const selectors = {
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
};

const gridPage = {
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  next: () => {
    return waitAndClick(selectors.BUTTON_NEXT_SUMMARY)
      .then(utils.waitPageLoaded)
      .then(this.init)
  },
  getStatus: () => {
    return element.all(by.css(selectors.LABEL_PAGE_STATUS)).first().getText()
    .then((text) => text.replace(',' , '').split('/').map((s) => parseInt(s)));
  },
  scrapeAll: scrapeAll
}

function scrapeAll(){
  return gridPage.init().then(() => utils.scrapeAll(gridPage)); //TODO: Use this.
}

module.exports = gridPage;
