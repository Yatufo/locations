const utils = require('./Utils.js')
const scraper = require('../scrapers/MatrixDetailsScraper.js');


const pageMatrix = {
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  scrape: (id) => {
        const LINK_ID = element(by.linkText(id));
        return browser.get(browser.params.matrixUrl)
        .then(() => waitAndClick(LINK_ID)) //open the criterias
        .then(pageMatrix.init).then(utils.scrape)
  }
}
module.exports = pageMatrix;
