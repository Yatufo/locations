const scrapeDetails = require('./ScraperDefinition.js').scrapeDetails;
const fs = require('fs');
const writer = fs.createWriteStream("scrapeResults.json")
const RELOAD_AFTER_AMOUNT = 3

describe('real state information', function() {

  it('get the details from the website', () => {
    browser.get('http://www.centris.ca/en');

    //open the criterias
    waitAndClick(element(by.css('#btn-advanced-criterias')));

    // select the criterias
    waitAndClick(element(by.css('#item-property > button:nth-child(5)')));

    // search
    waitAndClick(element(by.css('#search-form-bottom-actions button.btn.btn-search')));

    // select order by more recent first
    waitAndClick(element(by.css('#selectSortById')));

    // order by the most recent first
    waitAndClick(element(by.css('#selectSortById > div.dropdown.active > ul > li:nth-child(4)')));

    //Summary Tab button
    //waitAndClick(element.all(by.css('#divMainResult > div:nth-child(1) > div > div.description > a')).first());
    waitAndClick(element(by.css('#ButtonViewSummary')));

    function nextSummary() {
      return waitAndClick(element.all(by.css('#divWrapperPager > ul > li.next')).first());
    }


    function loadArtoo() {
      const result = browser.executeScript(() => {
        $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
        window.scrapeDetails = eval(arguments[0]);
      }, scrapeDetails.toString());

      browser.driver.sleep(500);

      return result;
    }

    function reload(counter, id) {
      const shouldReload = counter % RELOAD_AFTER_AMOUNT == 0;
      if (shouldReload) {
        console.log("reloading after scraping (" + counter + ") times");
        return browser.executeScript(() => {
            location.reload(true);
          })
          .then(loadArtoo)
      }

      return Promise.resolve();
    }

    let previous = '';
    let counter = 0;
    const scrapedIds = []

    function afterScraping(result) {
      if (!scrapedIds.includes(result.id)) {
        scrapedIds.push(result.id);

        writer.write(JSON.stringify(result) + ' , ', 'utf8', (e) => {
          console.log(e ? e : 'saved id:' + result.id + ', counter:' + counter);
        });

        browser.driver.sleep(1000);
      } else {
        console.log("Ignoring already processed id:" + result.id);
      }

      counter++;
      reload(counter).then(nextSummary).then(scrape);
    }

    function scrape() {
      const promisedResult = browser.executeScript("return scrapeDetails();");
      promisedResult.then(afterScraping);
      return promisedResult;
    }

    reload(0).then(scrape);

  });

});
