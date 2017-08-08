const pages = require('./pages/Pages.js');
const fs = require('fs');
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/updates.json";
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

  fit('get the details from the website', () => {
    const startTime = new Date().getTime();

    function scrapeDetails(prospect) {
      return pages.details.scrape(prospect.url)
        .then((details) => {
          console.log("scraped id:", prospect.id);
          return Object.assign(prospect, details);
        });
    }

    function saveAllResults(results) {
      results.forEach((r) => r.timestamp = startTime);

      const resultsToUpdate = results.filter((p) => p.updated);
      const resultsReady = results.filter((p) => !p.updated);

      return Promise.all(resultsToUpdate.map(scrapeDetails))
        .then((resultsUpdated) => resultsReady.concat(resultsUpdated))
        .then((resultsWithDetails) => {
          const writer = fs.createWriteStream(SCRAPED_DETAILS_FILE);
          writer.write(JSON.stringify(resultsWithDetails, null, 2))
        });
    }

    //saveAllResults(require("../" + SCRAPED_GRID_FILE)).catch((e) => console.log(e));

    scrapeSearch(pages.search.searchForCommercialPlexes, pages.grid, [], MAX_GRID_RESULTS)
      .then((commercial) => scrapeSearch(pages.search.searchForResidentialPlexes, pages.grid, commercial, MAX_GRID_RESULTS))
      .then((results) => {
        const writer = fs.createWriteStream(SCRAPED_GRID_FILE);
        writer.write(JSON.stringify(results, null, 2))
        return results;
      })
      .then(saveAllResults)
      .then((e) => console.log("Finished!!"))
      .catch((e) => console.log(e));


  });

  it('get the details from the matrix', () => {

    pages.matrix.first()
      .then(pages.matrix.init)
      .then(pages.matrix.scrapeAll)
      .then((results) => {
        const writer = fs.createWriteStream(SCRAPED_EXTRAS_FILE);
        writer.write(JSON.stringify(results, null, 2))
      })
      .then(() => console.log("Finished!!"))
      .catch((e) => console.log(e));

  });

  it('get the details from the matrix', () => {

    scrapeSearch(pages.search.searchForCommercialPlexes, pages.details, [], MAX_DETAILS_RESULTS)
      .then((results) => {
        const writer = fs.createWriteStream(SCRAPED_DETAILS_FILE);
        writer.write(JSON.stringify(results, null, 2))
      })
      .then(() => console.log("Finished!!"))
      .catch((e) => console.log(e));

  });



});
