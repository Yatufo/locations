

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
      .then(this.init); // waits so the ajax call has time to come back.
  },
  getStatus: () => {
    return element.all(by.css(selectors.LABEL_PAGE_STATUS)).first().getText()
      .then((text) => text.split('/').map((s) => parseInt(s)));
  },
  scrapeAll: scrape
}

const prospects = [];
let currentId = "";

function afterScraping([results, status]) {
  const [current, total] = status;
  const notFinished = current < total;
  const [first] = results;
  const infoIsLoaded = currentId !== first.id;

  if (infoIsLoaded) {
    currentId = first.id;
    results.forEach((item) => prospects.push(item));
    console.log("status: ", current, ' / ', total);
    return (notFinished ? gridPage.next().then(scrape) : Promise.resolve(prospects));
  } else {
    console.log("Ignoring already processed id: " + first.id + ' and trying again');
    return scrape();
  }
}

function scrape() {
  return Promise.all([utils.scrape(), gridPage.getStatus()]).then(afterScraping);
}

module.exports = gridPage;
