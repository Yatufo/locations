const utils = require('./Utils.js')
const scraper = require('../scrapers/MatrixDetailsScraper.js');

const selectors = {
  BUTTON_NEXT_SUMMARY: element(by.linkText("next")),
  LABEL_PAGE_STATUS: '#_ctl0_m_tdCloseFullLink',
  FIRST_LINK: 'span.pagingLinks'
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
  next: () => {
    return waitAndClick(selectors.BUTTON_NEXT_SUMMARY)
      .then(utils.waitPageLoaded)
      .then(this.init); // waits so the ajax call has time to come back.
  },
  getStatus: () => {
    return toElement(selectors.LABEL_PAGE_STATUS).element(by.xpath("..")).getText()
      .then(utils.formatters.arrayOfNumbers).then(([current,ignore,total]) => [current, total]);
  },
  scrapeAll: () => utils.scrapeAll(matrixPage)
}
module.exports = matrixPage;
