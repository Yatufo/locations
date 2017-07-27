const pages = require('./pages/Pages.js');
const utils = require('./pages/Utils.js');
const fs = require('fs');
const estatesFileName = "data/estates-" + new Date().toLocaleDateString() + ".json";
const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

const RELOAD_AFTER_AMOUNT = 100;
const SUMARY_URL_BASE = '/en/duplex~a-vendre~le-plateau-mont-royal-montreal/';

describe('real state information', function() {

  function processProspects(prospects) {
    if (prospects.length > 0) {
      const [head, ...tail] = prospects;
      pages.details.scrape(head.url)
        .then((result) => {
          const jsonString = JSON.stringify(Object.assign(head, result), null, 2) + ', ';
          writer.write(jsonString, (e) => console.log(e ? e : 'saved id:' + result.id));
        })
        .then(() => processProspects(tail))
    }
  }

  it('get the details from the website', () => {

    //processProspects([{url:"http://www.centris.ca/fr/maison~a-vendre~trois-rivieres/14638723?view=Summary"}])
    pages.search.searchForPlexes()
      .then(pages.grid.init)
      .then(pages.grid.scrapeAll)
      .then(processProspects)

  });

});
