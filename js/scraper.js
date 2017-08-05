const pages = require('./pages/Pages.js');
const fs = require('fs');
const SCRAPED_GRID_FILE = "./data/grid.json";
const SCRAPED_DETAILS_FILE = "./data/updates.json";

const gridwriter = fs.createWriteStream(SCRAPED_GRID_FILE, {
  flags: 'a',
  defaultEncoding: 'utf8'
});
const scrapedWriter = fs.createWriteStream(SCRAPED_DETAILS_FILE, {
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
      const resultsReady = results.filter((p) => !p.updated);

      return Promise.all(resultsToUpdate.map(scrapeDetails))
        .then((resultsUpdated) => resultsReady.concat(resultsUpdated))
        .then((results) => scrapedWriter.write(JSON.stringify(results, null, 2)));
    }

    function uniqueResults(results) {
          const uniqueIds = [];
          results.forEach((r) => r.timestamp = startTime);

          return results.filter((item) => {
            const isNotDuplicated = !uniqueIds.includes(item.id);
            if (isNotDuplicated) {
              uniqueIds.push(item.id);
              console.log("duplicated", item.id);
            }
            return isNotDuplicated;
          });
    }

    Promise.all([
        scrapeSearch(pages.search.searchForCommercialPlexes),
        scrapeSearch(pages.search.searchForResidentialPlexes)
      ])
      .then(([commercial, residential]) => commercial.concat(residential))
      .then(uniqueResults)
      .then((results) => {
        gridwriter.write(JSON.stringify(results, null, 2))
        return results;
      })
      .then(saveAllResults)
      .catch((e) => console.log(e));


  });

});
