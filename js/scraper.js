const pages = require('./pages/Pages.js');
const _ = require('lodash');
const fs = require('fs');
const SCRAPED_UPDATES_FILE = "./data/updates.json";
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/details.json";
const SCRAPED_EXTRAS_FILE = "./data/extras.json";
const SCRAPED_RMAX_FILE = "./data/rmax.json";
const MAX_GRID_RESULTS = false;
const MAX_DETAILS_RESULTS = 200;
const MAX_EXTRAS_RESULTS = 10;
const MAX_RMAX_RESULTS = 50;

describe('real state information', function() {
  const startTime = new Date().getTime();

  function scrapeSearch(search, page, initial, limit) {
    return search()
      .then(page.first)
      .then(page.init)
      .then(() => page.scrapeAll(initial, limit));
  }

  function getJsonMap(dataPath) {
    const result = {};
    require("../" + dataPath).forEach((item) => result[item.id] = item)
    return result;
  }

  function saveResults(results, fileName) {
    const writer = fs.createWriteStream(fileName);
    return new Promise((resolve, reject) => {
      const done = (e) => e ? reject(e) : resolve();
      writer.write(JSON.stringify(results, null, 2), done);
    });
  }

  it('get the grid', () => {
    const result = scrapeSearch(pages.search.searchForCommercialPlexes, pages.grid, [], MAX_GRID_RESULTS)
      .then((commercial) => {
        const limit = commercial.length + MAX_GRID_RESULTS;
        return scrapeSearch(pages.search.searchForResidentialPlexes, pages.grid, commercial, limit)
      })
      .then((results) => saveResults(results, SCRAPED_GRID_FILE))
      .then((e) => console.log("Finished grid!!"))
      .catch(console.log);

      protractor.promise.controlFlow().wait(result);

  });

  it('get the matrix', () => {
    const search = () => Promise.resolve(); // do nothing before.
    const result = scrapeSearch(search, pages.matrix, [], MAX_EXTRAS_RESULTS)
      .then((results) => saveResults(results, SCRAPED_EXTRAS_FILE))
      .then(() => console.log("Finished extras!!"))
      .catch(console.log);

      protractor.promise.controlFlow().wait(result);
  });

  it('get the details', () => {

    //TODO: Reuse multiple calls
    const result = scrapeSearch(pages.search.searchForCommercialPlexes, pages.details, [], MAX_DETAILS_RESULTS)
      .then((commercial) => {
        const limit = commercial.length + MAX_DETAILS_RESULTS;
        return scrapeSearch(pages.search.searchForResidentialPlexes, pages.details, commercial, limit)
      })
      .then((results) => saveResults(results, SCRAPED_DETAILS_FILE))
      .then(() => console.log("Finished details!!"))
      .catch(console.log);

      protractor.promise.controlFlow().wait(result);
  });

  it('get the rmaxs', () => {

    const result = scrapeSearch(pages.rmax.search, pages.rmax, [], MAX_RMAX_RESULTS)
    .then((results) => saveResults(results, SCRAPED_RMAX_FILE))
    .then(() => console.log("Finished rmax!!"))
    .catch(console.log);

    protractor.promise.controlFlow().wait(result);
  });

  //fit('extra test', () => {});

  afterAll(() => {
    const gridMap = getJsonMap(SCRAPED_GRID_FILE)
    const grids = Object.keys(gridMap).map((k) => gridMap[k]);
    const details = getJsonMap(SCRAPED_DETAILS_FILE);
    const extras = getJsonMap(SCRAPED_EXTRAS_FILE)
    const rmaxs = getJsonMap(SCRAPED_RMAX_FILE);

    const results = grids.map((g) => {
      g.timestamp = startTime;
      g.recent = g.updated;
      g.updated = g.recent || _.isObject(details[g.id])  || _.isObject(rmaxs[g.id]) || _.isObject(extras[g.id]);
      return Object.assign(g, details[g.id] || {}, rmaxs[g.id] || {}, extras[g.id] || {});
    });

    saveResults(results, SCRAPED_UPDATES_FILE);
  });


});
