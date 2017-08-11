const utils = require('./Utils.js')
const scraper = require('../scrapers/RmaxScraper.js');

const selectors = {
  DROPDOWN_PROPERTY_TYPE: element(by.buttonText('Residential')),
  SELECT_PROPERTY_TYPE_PLEX: element(by.cssContainingText('div.ms-drop li', 'Multiplex')),
  DROPDOWN_PLEX_TYPE: element(by.buttonText('Types :')),
  SELECT_PROPERTY_5PLUS: element(by.cssContainingText('div.ms-drop li', '5-6-7-Plex')),
  SELECT_PROPERTY_4PLEX: element(by.cssContainingText('div.ms-drop li', 'Quadruplex')),
  SELECT_PROPERTY_3PLEX: element(by.cssContainingText('div.ms-drop li', 'Triplex')),
  BUTTON_FIND: element(by.buttonText('Find.')),
  FIRST_PROSPECT_LINK: "a.property-details",
  BUTTON_NEXT_SUMMARY: element.all(by.linkText('Next Result')).first()
};

function search() {
  return browser.get(browser.params.rmaxUrl)
    .then(() => waitAndClick(selectors.DROPDOWN_PROPERTY_TYPE)) //open the property type
    .then(() => waitAndClick(selectors.SELECT_PROPERTY_TYPE_PLEX)) // Plexes.
    .then(() => waitAndClick(selectors.DROPDOWN_PLEX_TYPE)) // type of plex.
    .then(() => waitAndClick(selectors.SELECT_PROPERTY_5PLUS))
    .then(() => waitAndClick(selectors.SELECT_PROPERTY_4PLEX))
    .then(() => waitAndClick(selectors.SELECT_PROPERTY_3PLEX))
    .then(() => waitAndClick(selectors.BUTTON_FIND))
};

let counter = 1;
const rmaxPage = {
  search: search,
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  first: () => waitAndClick(selectors.FIRST_PROSPECT_LINK),
  next: () => {
    counter++;
    return waitAndClick(selectors.BUTTON_NEXT_SUMMARY)
    .then(rmaxPage.init)
  },
  getStatus: () => {
     // If it does not find the next button it means it reached the end.
    return new Promise((resolve, reject) => {
      waitAndClick(selectors.BUTTON_NEXT_SUMMARY)
        .then(() => resolve([counter, 111111111]))
        .catch((err) => resolve([counter, counter]))
    })
  },
  scrapeAll: (initial, limit) => {
    counter = 1;
    return utils.scrapeAll(rmaxPage, initial, limit)
  }
}

module.exports = rmaxPage;
