const scrapeDetails = require('./ScraperDefinition.js').scrapeDetails;
const fs = require('fs');
const writer = fs.createWriteStream("scrapeResults.json", {
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
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next'
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
    //waitAndClick(element.all(by.css('#divMainResult > div:nth-child(1) > div > div.description > a')).first());
    waitAndClick(element(by.css(selectors.BUTTON_SUMMARY_TAB)));

    function nextSummary() {
      return waitAndClick(element.all(by.css(selectors.BUTTON_NEXT_SUMMARY)).first());
    }


    function loadArtoo() {
      const result = browser.executeScript(() => {
        $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
        window.scrapeDetails = eval(arguments[0]);
      }, scrapeDetails.toString());

      browser.driver.sleep(1000);

      return result;
    }

    function reload(counter, id) {
      const shouldReload = counter % RELOAD_AFTER_AMOUNT == 0;
      if (shouldReload) {
        console.log("reloading after scraping (" + counter + ") times");
        return browser.get(SUMARY_URL_BASE + id).then(loadArtoo);
      }

      return Promise.resolve();
    }

    let previous = '';
    let counter = 0;
    const scrapedIds = []
    let lastId = ''

    function afterScraping(result) {
      if (!scrapedIds.includes(result.id)) {
        lastId = result.id
        scrapedIds.push(result.id);

        writer.write(JSON.stringify(result) + ' , ', (e) => {
          console.log(e ? e : 'saved id:' + result.id + ', counter:' + counter);
        });

        counter++;
        reload(counter, lastId).then(nextSummary).then(scrape);
      } else {
        console.log("Ignoring already processed id:" + result.id + 'and trying again');
        browser.driver.sleep(500);
        scrape();
      }

    }

    function scrape() {
      const promisedResult = browser.executeScript("return scrapeDetails();");
      promisedResult.then(afterScraping);
      return promisedResult;
    }

    loadArtoo().then(scrape());

  });

});
