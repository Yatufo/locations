const scrapeDetails = require('./ScraperDefinition.js').scrapeDetails;

describe('angularjs homepage todo list', function() {

  it('should add a todo', function() {
    browser.get('http://www.centris.ca/en');

    //open the criterias
    const advancedCriterias = element(by.css('#btn-advanced-criterias'));
    EC.elementToBeClickable(advancedCriterias, 5000);
    advancedCriterias.click();

    // select the criterias
    element(by.css('#item-property > button:nth-child(5)')).click() //plex
    element(by.css('#search-form-bottom-actions > div > div > button.btn.btn-search')).click() // search
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

    const nextButton = element(by.css('#divWrapperPager > ul > li.next'))
    EC.elementToBeClickable(nextButton, 5000);

    function afterScraping(result){
        console.log(result);
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
