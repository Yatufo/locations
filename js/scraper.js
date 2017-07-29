
const pages = require('./pages/Pages.js');
const processor = require('./pages/Processor.js');

describe('real state information', function() {

  it('get the details from the website', () => {

    pages.search.searchForPlexes()
      .then(pages.grid.init)
      .then(pages.grid.scrapeAll)
      .then(processor.processProspects)

  });

});
