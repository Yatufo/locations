const pages = require('./pages/Pages.js');
const fs = require('fs');
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/updates.json";

const gridwriter = fs.createWriteStream(SCRAPED_GRID_FILE);
const scrapedWriter = fs.createWriteStream(SCRAPED_DETAILS_FILE);

describe('real state information', function() {

  it('get the details from the website', () => {
    const startTime = new Date().getTime();

    function scrapeDetails(prospect) {
      return pages.details.scrape(prospect.url)
        .then((scraped) => {
          console.log("scraped id:", scraped.id);
          return Object.assign(prospect, scraped)
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

    // saveAllResults(require("../" + SCRAPED_GRID_FILE));

      scrapeSearch(pages.search.searchForCommercialPlexes)
      .then(() => scrapeSearch(pages.search.searchForResidentialPlexes))
      .then((results) => {
        gridwriter.write(JSON.stringify(results, null, 2))
        return results;
      })
      .then(saveAllResults)
      .catch((e) => console.log("Finished!!"))
      .catch((e) => console.log(e));


  });

});
