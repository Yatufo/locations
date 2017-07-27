const pages = require('./pages/Pages.js');
const fs = require('fs');
const estatesFileName = "data/estates-" + new Date().toLocaleDateString() + ".json";
const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

const RELOAD_AFTER_AMOUNT = 100;
const SUMARY_URL_BASE = '/en/duplex~a-vendre~le-plateau-mont-royal-montreal/';

describe('real state information', function() {

  it('get the details from the website', () => {

    const prospects = [];

    let currentId = "";
    pages.search.searchForPlexes()
      .then(pages.grid.init)
      .then(scrape)
      .then(console.log)


    function afterScraping(params) {
      const [results, status] = params;
      const [current, total] = status;
      const notFinished = current < total;
      const [first] = results;

      console.log("ids: ", firstId, currentId, status);
      if (currentId !== first.id) {
        results.forEach((item) => prospects.push(item));
        currentId = first.id;
        return (notFinished ? pages.grid.next() : Promise.reject(prospects));
      } else {
        console.log("Ignoring already processed id: " + first.id + ' and trying again');
        return Promise.resolve();
      }
    }

    function scrape() {
      return Promise.all([pages.scrape(), pages.grid.getStatus()])
        .then(afterScraping).then(scrape);
    }

    //
    // // .then(() => {
    // //   return scrapeNext(0, browser.params.startId);
    // // })
    //
    // function scrapeNext(counter, id) {
    //   if (!id) {
    //     return pages.details.init().then(scrape);
    //   } else {
    //     return reload(counter, id).then(pages.details.next).then(scrape);
    //   }
    // }
    //
    // function reload(counter, id) {
    //   const shouldReload = counter % RELOAD_AFTER_AMOUNT == 0;
    //   if (shouldReload && id) {
    //     console.log("reloading after scraping (" + counter + ") times");
    //     return browser.get(SUMARY_URL_BASE + id).then(pages.details.init);
    //   }
    //
    //   return Promise.resolve();
    // }
    //
    // let previous = '';
    // let counter = 0;
    // const scrapedIds = []
    //
    // function afterScraping(result) {
    //   if (!scrapedIds.includes(result.id)) {
    //     scrapedIds.push(result.id);
    //
    //     writer.write(JSON.stringify(result, null, 2) + ' , ', (e) => {
    //       console.log(e ? e : 'saved id:' + result.id + ', counter:' + counter);
    //     });
    //
    //     counter++;
    //     scrapeNext(counter, result.id);
    //   } else {
    //     console.log("Ignoring already processed id: " + result.id + ' and trying again');
    //     scrape();
    //   }
    //
    // }
    //
    // function scrape() {
    //   return pages.scrape().then(afterScraping);
    // }

  });

});
