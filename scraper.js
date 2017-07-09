const scrapeDetails = require('./ScraperDefinition.js').scrapeDetails;
const fs = require('fs');
const writer = fs.createWriteStream("scrapeResults.json")

describe('real state information', function() {

  it('get the details from the website', function() {
    browser.get('http://www.centris.ca/en');

    //open the criterias
    const advancedCriterias = element(by.css('#btn-advanced-criterias'));
    EC.elementToBeClickable(advancedCriterias, 5000);
    advancedCriterias.click();

    // select the criterias
    element(by.css('#item-property > button:nth-child(5)')).click() //plex
    searchButton = element(by.css('#search-form-bottom-actions button.btn.btn-search'))
    EC.elementToBeClickable(searchButton, 5000);
    searchButton.click(); // search

    browser.driver.sleep(2000);

    // select order by more recent first
    const orderByButton = element(by.css('#selectSortById'));
    EC.elementToBeClickable(orderByButton, 5000);
    orderByButton.click();

    const orderByRecent = element(by.css('#selectSortById > div.dropdown.active > ul > li:nth-child(4)'))
    EC.elementToBeClickable(orderByRecent, 5000);
    orderByRecent.click();

    browser.driver.sleep(1000);

    const firstSummaryButton = element.all(by.css('#divMainResult > div:nth-child(1) > div > div.description > a')).first();
    EC.elementToBeClickable(firstSummaryButton, 5000);
    firstSummaryButton.click();

    const removeWhiteSpace = (s) => s.replace(/ /g, '');
    const pageStatusText = element(by.css('.wrapper-tabs #divWrapperPager > ul > li.pager-current'));
    EC.elementToBeClickable(pageStatusText, 5000);

    browser.executeScript(() => {
      $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
    });

    browser.driver.sleep(1000);

    const nextButton = element.all(by.css('#divWrapperPager > ul > li.next')).first();
    EC.elementToBeClickable(nextButton, 5000);

    function afterScraping(result) {

      writer.write(JSON.stringify(result) + ' , ', 'utf8', (e) => {
        console.log(e ? e : 'saved id:' + result.id);
      })

      nextButton.click();
      scrape();
    }

    function scrape() {
      const promisedResult = browser.executeScript(scrapeDetails);
      promisedResult.then(afterScraping);
      return promisedResult;
    }

    scrape();


    browser.driver.sleep(3000);

  });


});
