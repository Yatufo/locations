const scrapeDetails = require('./ScraperDefinition.js').scrapeDetails;
const fs = require('fs');
const writer = fs.createWriteStream("scrapeResults.json")

describe('real state information', function() {

  it('get the details from the website', function() {
    browser.get('http://www.centris.ca/en');

    //open the criterias
    const advancedCriterias = element(by.css('#btn-advanced-criterias'));
    browser.wait(EC.elementToBeClickable(advancedCriterias), 5000);
    advancedCriterias.click();


    // select the criterias
    const plexCheck = element(by.css('#item-property > button:nth-child(5)'))
    browser.wait(EC.elementToBeClickable(plexCheck), 5000);
    plexCheck.click() //plex


    searchButton = element(by.css('#search-form-bottom-actions button.btn.btn-search'))
    browser.wait(EC.elementToBeClickable(searchButton), 5000);
    searchButton.click(); // search

    // select order by more recent first
    const orderByButton = element(by.css('#selectSortById'));
    browser.wait(EC.elementToBeClickable(orderByButton), 5000);
    orderByButton.click();

    const orderByRecent = element(by.css('#selectSortById > div.dropdown.active > ul > li:nth-child(4)'))
    browser.wait(EC.elementToBeClickable(orderByRecent), 5000);
    orderByRecent.click();

    browser.driver.sleep(1000);

    const firstSummaryButton = element.all(by.css('#divMainResult > div:nth-child(1) > div > div.description > a')).first();
    browser.wait(EC.elementToBeClickable(firstSummaryButton), 5000);
    firstSummaryButton.click();

    const removeWhiteSpace = (s) => s.replace(/ /g, '');
    const pageStatusText = element(by.css('.wrapper-tabs #divWrapperPager > ul > li.pager-current'));
    browser.wait(EC.elementToBeClickable(pageStatusText), 5000);


    const nextButton = element.all(by.css('#divWrapperPager > ul > li.next')).first();
    browser.wait(EC.elementToBeClickable(nextButton), 5000);


    const loadArtoo = browser.executeScript(() => {
      $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
    });

    browser.driver.sleep(3000);

    let previous = '';
    let counter = 0;

    function afterScraping(result) {

      if (result.id != previous) {
        counter++;
        previous = result.id;
        writer.write(JSON.stringify(result) + ' , ', 'utf8', (e) => {
          console.log(e ? e : 'saved id:' + result.id + ', counter:' + counter);
        });

        nextButton.click().then(scrape);

      } else {
        scrape(); // try again.
      }
    }

    function scrape() {
      const promisedResult = browser.executeScript(scrapeDetails);
      promisedResult.then(afterScraping);
      return promisedResult;
    }

    loadArtoo.then(scrape);

  });


});
