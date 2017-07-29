const pages = require('./pages/Pages.js');
const processor = require('./pages/Processor.js');

describe('real state information', function() {

  it('get the details from the website', () => {
    const startTime = new Date().getTime();

    function scrapeSearch(search, isLastGroup) {
      return search.then(pages.grid.init)
        .then(pages.grid.scrapeAll)
        .then((results) => processor.processProspects(results, startTime, isLastGroup));
    }
    
    processor.start()
    .then(() => scrapeSearch(pages.search.searchForCommercialPlexes(), false))
    .then(() => scrapeSearch(pages.search.searchForResidentialPlexes(), true));

  });

});
