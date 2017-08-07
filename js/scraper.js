const pages = require('./pages/Pages.js');
const fs = require('fs');
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/updates.json";

const scrapedWriter = fs.createWriteStream(SCRAPED_DETAILS_FILE);

describe('real state information', function() {

  it('get the details from the website', () => {
    const startTime = new Date().getTime();

    function scrapeDetails(prospect) {
      return Promise.all([pages.details.scrape(prospect.url), pages.matrix.scrape(prospect.id)])
        .then(([details, extras]) => {
          console.log("scraped id:", prospect.id);
          return Object.assign(prospect, details, {
            extras: extras
          })
        });
    }

    function scrapeSearch(search) {
      return search().then(pages.grid.init).then(pages.grid.scrapeAll);
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
      .then(() => scrapeSearch(pages.search.searchForResidentialPlexes))
      .then((results) => {
        const gridwriter = fs.createWriteStream(SCRAPED_GRID_FILE);
        gridwriter.write(JSON.stringify(results, null, 2))
        return results;
      })
      .then(saveAllResults)
      .then((e) => console.log("Finished!!"))
      .catch((e) => console.log(e));


  });

  fit('get the details from the matrix', () => {

    pages.matrix.first()
      .then(pages.matrix.init)
      .then(pages.matrix.scrapeAll)
      .then((e) => console.log("Finished!!"))
      .catch((e) => console.log(e));

  });


});
