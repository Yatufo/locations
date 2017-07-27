const pages = require('./pages/Pages.js');
const fs = require('fs');
const estatesFileName = "data/estates-" + new Date().toLocaleDateString() + ".json";
const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

describe('real state information', function() {

  function saveProspect(prospect) {
    const jsonString = JSON.stringify(prospect, null, 2) + ', ';
    writer.write(jsonString, (e) => console.log(e ? e : 'saved id:' + prospect.id));
  }

  function processProspects(prospects) {
    if (prospects.length > 0) {
      const [head, ...tail] = prospects;
      
      (head.updated ? pages.details.scrape(head.url) : Promise.resolve({}))
        .then((scraped) => saveProspect(Object.assign(head, scraped)))
        .then(() => processProspects(tail))
    }
  }

  it('get the details from the website', () => {

    pages.search.searchForPlexes()
      .then(pages.grid.init)
      .then(pages.grid.scrapeAll)
      .then(processProspects)

  });

});
