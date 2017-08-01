const pages = require('./pages/Pages.js');
const processor = require('./pages/Processor.js');
const fs = require('fs');
const SCRAPED_GRID_FILE = "./data/grid.json";
const gridwriter = fs.createWriteStream(SCRAPED_GRID_FILE, {flags: 'a',defaultEncoding: 'utf8'});

describe('real state information', function() {

  it('get the details from the website', () => {
    const startTime = new Date().getTime();

    function scrapeSearch(search, isLastGroup) {
      return search().then(pages.grid.init).then(pages.grid.scrapeAll)
    }

    Promise.all([
        scrapeSearch(pages.search.searchForCommercialPlexes),
        scrapeSearch(pages.search.searchForResidentialPlexes)
      ])
      .then(([commercial, residential]) => commercial.concat(residential))
      .then((results) => JSON.stringify(results, null, 2))
      .then((results) => gridwriter.write(results))
      .then(() => {
        const results = require("../" + SCRAPED_GRID_FILE);
        processor.processProspects(results, startTime, true);
      });
  });

});
