const pages = require('./pages/Pages.js');
const fs = require('fs');
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/updates.json";

const gridwriter = fs.createWriteStream(SCRAPED_GRID_FILE, {
  flags: 'a',
  defaultEncoding: 'utf8'
});
const scrapedwriter = fs.createWriteStream(SCRAPED_DETAILS_FILE, {
  defaultEncoding: 'utf8'
});

describe('real state information', function() {

  it('get the details from the website', () => {
    const startTime = new Date().getTime();

    function scrapeDetails(prospect) {
      return pages.details.scrape(prospect.url)
        .then((scraped) => {
          Object.assign(prospect, scraped)
          console.log("scraped id:", scraped.id);
        });
    }

    function scrapeSearch(search) {
      return search().then(pages.grid.init).then(pages.grid.scrapeAll);
    }

    function saveAllResults(results) {
      const resultsToUpdate = results.filter((p) => p.updated);

      Promise.all(resultsToUpdate.map(scrapeDetails))
        .then((resultsUpdated) => results.filter((p) => !p.updated).concat(resultsUpdated))
        .then((results) => scrapedwriter.write(JSON.stringify(results, null, 2)));
    }

    function uniqueResults(results) {
          const uniqueIds = [];
          results.forEach((r) => r.timestamp = startTime);

          return results.filter((item) => {
            const isNotDuplicated = !uniqueIds.includes(item.id);
            if (isNotDuplicated) uniqueIds.push(item);
            return isNotDuplicated;
          });
    }

    // const results = require("../" + SCRAPED_GRID_FILE); // Only if required.
    // saveAllResults(uniqueResults(results));


    Promise.all([
        scrapeSearch(pages.search.searchForCommercialPlexes),
        scrapeSearch(pages.search.searchForResidentialPlexes)
      ])
      .then(([commercial, residential]) => commercial.concat(residential))
      .then(uniqueResults);
      .then((results) => {        
        gridwriter.write(JSON.stringify(results, null, 2))
        return results;
      })
      .then(saveAllResults);


  });

});
