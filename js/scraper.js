const pages = require('./pages/Pages.js');
const fs = require('fs');
const SCRAPED_UPDATES_FILE = "./data/updates.json";
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/details.json";
const SCRAPED_EXTRAS_FILE = "./data/extras.json";
const MAX_GRID_RESULTS = false;
const MAX_DETAILS_RESULTS = 5;
const MAX_EXTRAS_RESULTS = 5;

describe('real state information', function() {

  function scrapeSearch(search, page, initial, limit) {
    return search()
      .then(page.first)
      .then(page.init)
      .then(() => page.scrapeAll(initial, limit));
  }

  function getJson(dataPath) {
    return require("../" + dataPath);
  }

  it('get the grid', () => {
    const startTime = new Date().getTime();

    function scrapeDetails(prospect) {
      return pages.details.scrape(prospect.url)
        .then((details) => {
          console.log("scraped id:", prospect.id);
          return Object.assign(prospect, details);
        });
    }

    scrapeSearch(pages.search.searchForCommercialPlexes, pages.grid, [], MAX_GRID_RESULTS)
      .then((commercial) => {
        const limit = commercial.length + MAX_GRID_RESULTS;
        return scrapeSearch(pages.search.searchForResidentialPlexes, pages.grid, commercial, limit)
      })
      .then((results) => {
        const writer = fs.createWriteStream(SCRAPED_GRID_FILE);
        writer.write(JSON.stringify(results, null, 2))
        return results;
      })
      .then((e) => console.log("Finished grid!!"))
      .catch((e) => console.log(e));


  });

  it('get the matrix', () => {
    const search = () => Promise.resolve(); // do nothing before.
    scrapeSearch(search, pages.matrix, [], MAX_EXTRAS_RESULTS)
      .then((results) => {
        const writer = fs.createWriteStream(SCRAPED_EXTRAS_FILE);
        writer.write(JSON.stringify(results, null, 2))
      })
      .then(() => console.log("Finished extras!!"))
      .catch((e) => console.log(e));

  });

  it('get the details', () => {

    //TODO: Reuse multiple calls
    scrapeSearch(pages.search.searchForCommercialPlexes, pages.details, [], MAX_DETAILS_RESULTS)
      .then((commercial) =>{
        const limit = commercial.length + MAX_DETAILS_RESULTS;
        return scrapeSearch(pages.search.searchForResidentialPlexes, pages.details, commercial, limit)
      })
      .then((results) => {
        const writer = fs.createWriteStream(SCRAPED_DETAILS_FILE);
        writer.write(JSON.stringify(results, null, 2))
      })
      .then(() => console.log("Finished details!!"))
      .catch((e) => console.log(e));

  });


  afterAll(() => {
    const grid = getJson(SCRAPED_GRID_FILE);
    const details = {}, extras = {};

    getJson(SCRAPED_DETAILS_FILE).forEach((item) => details[item.id] = item);
    getJson(SCRAPED_EXTRAS_FILE).forEach((item) => extras[item.id] = item);

    const updates = getJson(SCRAPED_GRID_FILE).map((g) => {
      return Object.assign(g, details[g.id] || {}, extras[g.id] || {});
    });

    const writer = fs.createWriteStream(SCRAPED_UPDATES_FILE);
    writer.write(JSON.stringify(updates, null, 2))
  });


});
