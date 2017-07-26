const pages = require('./Pages.js');
const fs = require('fs');
const estatesFileName = "data/estates-" + new Date().toLocaleDateString() + ".json";
const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

const RELOAD_AFTER_AMOUNT = 100;
const SUMARY_URL_BASE = '/en/duplex~a-vendre~le-plateau-mont-royal-montreal/';
const BUTTON_NEXT_SUMMARY = pages.pageDetails.selectors.BUTTON_NEXT_SUMMARY;

describe('real state information', function() {

  it('get the details from the website', () => {

    pages.pageSearch.searchForPlexes()
      .then(() => {
        return scrapeNext(0, browser.params.startId);
      })

    function scrapeNext(counter, id) {
      if (!id) {
        return pages.pageDetails.loadScraper().then(scrape);
      } else {
        return reload(counter, id).then(pages.pageDetails.next).then(scrape);
      }
    }

    function reload(counter, id) {
      const shouldReload = counter % RELOAD_AFTER_AMOUNT == 0;
      if (shouldReload && id) {
        console.log("reloading after scraping (" + counter + ") times");
        return browser.get(SUMARY_URL_BASE + id).then(pages.pageDetails.loadScraper);
      }

      return Promise.resolve();
    }

    let previous = '';
    let counter = 0;
    const scrapedIds = []

    function afterScraping(result) {
      if (!scrapedIds.includes(result.id)) {
        scrapedIds.push(result.id);

        writer.write(JSON.stringify(result, null, 2) + ' , ', (e) => {
          console.log(e ? e : 'saved id:' + result.id + ', counter:' + counter);
        });

        counter++;
        scrapeNext(counter, result.id);
      } else {
        console.log("Ignoring already processed id: " + result.id + ' and trying again');
        scrape();
      }

    }

    function scrape() {
      return pages.pageDetails.scrape().then(afterScraping);
    }

  });

});
