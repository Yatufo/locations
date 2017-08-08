const utils = require('./Utils.js')
const scraper = require('../scrapers/MatrixDetailsScraper.js');

const selectors = {
  BUTTON_NEXT_SUMMARY: element(by.linkText("Next")),
  LABEL_PAGE_STATUS: '#_ctl0_m_tdCloseFullLink',
  FIRST_PROSPECT_LINK: element.all(by.css('#wrapperTable a')).first()
};

const matrixPage = {
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  scrape: (id) => {
    const LINK_ID = element(by.linkText(id));
    return browser.get(browser.params.matrixUrl)
      .then(() => waitAndClick(LINK_ID, 300)) //open the criterias
      .then(matrixPage.init).then(utils.scrape)
      .catch((e) => console.log("Not found on the first page, ignore id: ", id, e.message));
  },
  first: () => {
    return browser.get(browser.params.matrixUrl)
    .then(() => waitAndClick(selectors.FIRST_PROSPECT_LINK));
  },
  next: () => waitAndClick(selectors.BUTTON_NEXT_SUMMARY),
  getStatus: () => {
    return element(by.css(selectors.LABEL_PAGE_STATUS)).element(by.xpath(".."))
    .getText().then(utils.formatters.arrayOfInts);
  },
  scrapeAll: (initial) => utils.scrapeAll(matrixPage, initial)
}
module.exports = matrixPage;
