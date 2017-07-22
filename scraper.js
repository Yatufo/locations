const scrapeDetails = require('./ScraperDefinition.js').scrapeDetails;
const fs = require('fs');
const estatesFileName = "data/estates-" + new Date().toLocaleDateString() + ".json";
const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

const RELOAD_AFTER_AMOUNT = 100;
const SUMARY_URL_BASE = '/en/duplex~a-vendre~le-plateau-mont-royal-montreal/';
const selectors = {
  CHANGE_LANGUAGE: '#header-wrapper > div.top-nav > nav > ul.right-menu > li:nth-child(3) > a',
  BUTTON_CRITERIAS: '#btn-advanced-criterias',
  OPTION_PLEX: '#item-property > button:nth-child(5)',
  BUTTON_SEARCH: '#search-form-bottom-actions button.btn.btn-search',
  SELECTOR_ORDER: '#selectSortById',
  SELECT_RECENT: '#selectSortById > div.dropdown.active > ul > li:nth-child(4)',
  BUTTON_SUMMARY_TAB: '#ButtonViewSummary',
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
};

describe('real state information', function() {

  it('get the details from the website', () => {
    browser.get('/');

    //open the criterias
    waitAndClick(element(by.css(selectors.BUTTON_CRITERIAS)));

    // select the criterias
    waitAndClick(element(by.css(selectors.OPTION_PLEX)));

    // search
    waitAndClick(element(by.css(selectors.BUTTON_SEARCH)));

    // select order by more recent first
    waitAndClick(element(by.css(selectors.SELECTOR_ORDER)));

    // order by the most recent first
    waitAndClick(element(by.css(selectors.SELECT_RECENT)));

    //Summary Tab button
    waitAndClick(element(by.css(selectors.BUTTON_SUMMARY_TAB)));

    function nextSummary() {
      return waitAndClick(element.all(by.css(selectors.BUTTON_NEXT_SUMMARY)).first())
        .then(() => {
          return browser.driver.sleep(100); // waits so the ajax call has time to come back.
        });
    }


    function loadArtoo() {
      return browser.executeScript(() => {
          $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
          window.scrapeDetails = eval(arguments[0]);
        }, scrapeDetails.toString())
        .then(() => {
          return browser.driver.sleep(3000);
        });
    }

    function reload(counter, id) {
      const shouldReload = counter % RELOAD_AFTER_AMOUNT == 0;
      if (shouldReload && id) {
        console.log("reloading after scraping (" + counter + ") times");
        return browser.get(SUMARY_URL_BASE + id).then(loadArtoo);
      }

      return Promise.resolve();
    }

    let previous = '';
    let counter = 0;
    const scrapedIds = []

    function afterScraping(result) {
      if (!scrapedIds.includes(result.id)) {
        scrapedIds.push(result.id);

        writer.write(JSON.stringify(result) + ' , ', (e) => {
          console.log(e ? e : 'saved id:' + result.id + ', counter:' + counter);
        });

        counter++;
        reload(counter, result.id).then(nextSummary).then(scrape);
      } else {
        console.log("Ignoring already processed id:" + result.id + 'and trying again');
        scrape();
      }

    }

    function scrape() {
      return browser.executeScript("return scrapeDetails();").then(afterScraping);
    }

    reload(counter, browser.params.startId)
    .then(loadArtoo())
    .then(scrape());
  });

});
