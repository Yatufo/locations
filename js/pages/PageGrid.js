

const utils = require('./Utils.js')
const scraper = require('../scrapers/GridScraper.js');

const selectors = {
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
};

const gridPage = {
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  next: () =>  waitAndClick(selectors.BUTTON_NEXT_SUMMARY).then(() => browser.driver.sleep(300)),
  getStatus: () => {
    return element.all(by.css(selectors.LABEL_PAGE_STATUS)).first().getText()
      .then((text) => text.split('/').map((s) => parseInt(s)));
  },
  scrapeAll: (initial, limit) => utils.scrapeAll(gridPage, initial, limit)
}


module.exports = gridPage;
