describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    // browser.get('http://www.centris.ca/en');
    browser.get('http://www.centris.ca/en/maison~a-vendre~saint-eustache/19167007?view=Summary');

    // //open the criterias
    // const advancedCriterias = element(by.css('#btn-advanced-criterias'));
    // EC.elementToBeClickable(advancedCriterias, 5000);
    // advancedCriterias.click();
    //
    // // select the criterias
    // element(by.css('#item-property > button:nth-child(5)')).click() //plex
    // element(by.css('#search-form-bottom-actions > div > div > button.btn.btn-search')).click() // search
    // browser.driver.sleep(2000);
    //
    // // select order by more recent first
    // const orderByButton = element(by.css('#selectSortById'));
    // EC.elementToBeClickable(orderByButton, 5000);
    // orderByButton.click();
    //
    // const orderByRecent = element(by.css('#selectSortById > div.dropdown.active > ul > li:nth-child(4)'))
    // EC.elementToBeClickable(orderByRecent, 5000);
    // orderByRecent.click();
    //
    // browser.driver.sleep(1000);
    //
    // const firstSummaryButton = element.all(by.css('#divMainResult > div:nth-child(1) > div > div.description > a')).first();
    // EC.elementToBeClickable(firstSummaryButton, 5000);
    // firstSummaryButton.click();

    browser.executeScript(() => {
      $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
    });

    browser.driver.sleep(1000);

    browser.executeScript(() => {

      const getRowSelector = (name) => {
        return {
          sel: 'tr:contains("' + name + '") td.last-child',
          method: 'text'
        };
      };

      return artoo.scrape('#overview div.description', {
        score: {
          sel: 'div.walkscore',
          method: 'text'
        },
        address: {
          sel: 'div.address > h2',
          method: 'text'
        },
        price: {
          sel: '#BuyPrice',
          attr: 'content'
        },
        revenu: getRowSelector("Potential gross revenue"),
        usage: getRowSelector("Use of property"),
        style: getRowSelector("Building style"),
        year: getRowSelector("Year built"),
        areaLot: getRowSelector("Lot area"),
        parking: getRowSelector("Parking"),
        fireplace: getRowSelector("Fireplace/Stove"),
        units: getRowSelector("Number of units"),
        residentialUnits: getRowSelector("Residential units"),
        mainUnit: getRowSelector("Main unit"),
        features: getRowSelector("Additional features")
      });
    }).then((result) => {
      console.log(result);
    });
  });
});
