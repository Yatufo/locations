

const utils = require('./Utils.js')
const scraper = require('../scrapers/DetailsScraper.js');
const selectors = {
  BUTTON_SUMMARY_TAB: '#ButtonViewSummary',
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
}
const pageDetails = {
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  first: () => waitAndClick(selectors.BUTTON_SUMMARY_TAB).then(() => browser.driver.sleep(300)),
  scrape: (url) => browser.get(url).then(pageDetails.init).then(utils.scrape),
  next: () =>  waitAndClick(selectors.BUTTON_NEXT_SUMMARY).then(() => browser.driver.sleep(300)),
  getStatus: () => {
    return element.all(by.css(selectors.LABEL_PAGE_STATUS)).first().getText()
      .then((t) => utils.formatters.arrayOfInts(t.replace(",", "")));
  },
  scrapeAll: (initial, limit) => utils.scrapeAll(pageDetails, initial, limit)
}
module.exports = pageDetails;
