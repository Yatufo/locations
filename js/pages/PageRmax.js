const utils = require('./Utils.js')
const scraper = require('../scrapers/RmaxScraper.js');

const dropItemByName = (name) => element(by.cssContainingText('div.ms-drop li', name));
const selectors = {
  DROPDOWN_PROPERTY_TYPE: element(by.buttonText('Residential')),
  SELECT_PROPERTY_TYPE_PLEX: dropItemByName('Multiplex'),
  DROPDOWN_PLEX_TYPE: element(by.buttonText('Types :')),
  SELECT_PROPERTY_5PLUS: dropItemByName('5-6-7-Plex'),
  SELECT_PROPERTY_4PLEX: dropItemByName('Quadruplex'),
  SELECT_PROPERTY_3PLEX: dropItemByName('Triplex'),
  DROPDOWN_REGIONS: element(by.buttonText('Regions :')),
  SELECT_GRAND_MONTREAL: dropItemByName('Greater Montréal'),
  BUTTON_FIND: element(by.buttonText('Find.')),
  FIRST_PROSPECT_LINK: "a.property-details",
  LABEL_TOTAL_RESULTS: element(by.css("p.properties-total")),
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
    .then(() => waitAndClick(selectors.DROPDOWN_REGIONS)) // type of plex.
    .then(() => waitAndClick(selectors.SELECT_GRAND_MONTREAL))
    .then(() => waitAndClick(selectors.BUTTON_FIND))
};

let counter = 1;
let totalResults = 0;
const MAX_REMAX_SEARCH_RESULTS = 500;

const rmaxPage = {
  search: search,
  init: () => utils.waitPageLoaded().then(() => utils.loadScraper(scraper)),
  first: () => {
    //gets the total results before going to the first details page
    selectors.LABEL_TOTAL_RESULTS.getText()
    .then((text) => {
      const n = utils.formatters.numberOnly(text)
      totalResults = n > MAX_REMAX_SEARCH_RESULTS ? MAX_REMAX_SEARCH_RESULTS : n;
    })

    return waitAndClick(selectors.FIRST_PROSPECT_LINK);
  },
  next: () => {
    counter++;
    return waitAndClick(selectors.BUTTON_NEXT_SUMMARY)
      .then(rmaxPage.init)
  },
  getStatus: () => Promise.resolve([counter, totalResults]),
  scrapeAll: (initial, limit) => {
    counter = 1;
    return utils.scrapeAll(rmaxPage, initial, limit)
  }
}

module.exports = rmaxPage;
