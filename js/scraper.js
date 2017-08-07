const pages = require('./pages/Pages.js');
const fs = require('fs');
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/updates.json";
const SCRAPED_EXTRAS_FILE = "./data/extras.json";

const scrapedWriter = fs.createWriteStream(SCRAPED_DETAILS_FILE);

describe('real state information', function() {

  fit('get the details from the website', () => {
    const startTime = new Date().getTime();

    function scrapeDetails(prospect) {
      return pages.details.scrape(prospect.url)
        .then((details) => {
          console.log("scraped id:", prospect.id);
          return Object.assign(prospect, details);
        });
    }

    function scrapeSearch(search, initial) {
      return search().then(pages.grid.init).then(() => pages.grid.scrapeAll(initial));
    }

    function saveAllResults(results) {
      results.forEach((r) => r.timestamp = startTime);

      const resultsToUpdate = results.filter((p) => p.updated);
      const resultsReady = results.filter((p) => !p.updated);

      return Promise.all(resultsToUpdate.map(scrapeDetails))
        .then((resultsUpdated) => resultsReady.concat(resultsUpdated))
        .then((resultsWithDetails) => scrapedWriter.write(JSON.stringify(resultsWithDetails, null, 2)));
    }

    //saveAllResults(require("../" + SCRAPED_GRID_FILE)).catch((e) => console.log(e));


    scrapeSearch(pages.search.searchForCommercialPlexes)
      .then((commercial) => scrapeSearch(pages.search.searchForResidentialPlexes, commercial))
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


});
