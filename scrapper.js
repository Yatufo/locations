describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('http://www.centris.ca/');

    //open the criterias
    element(by.id('btn-advanced-criterias')).click();

    // select the criterias
    element(by.css('button.btn-form-choice:nth-child(5)')).click()
    element(by.css('button.btn:nth-child(3)')).click()
    browser.driver.sleep(2000);

    // select order by more recent first
    const orderByButton = element(by.css('#selectSortById'));
    EC.elementToBeClickable(orderByButton, 5000);
    orderByButton.click();

    const orderByRecent = element(by.css('#selectSortById > div.dropdown.active > ul > li:nth-child(4)'))
    EC.elementToBeClickable(orderByRecent, 5000);
    orderByRecent.click();

    browser.driver.sleep(1000);

  });
});
