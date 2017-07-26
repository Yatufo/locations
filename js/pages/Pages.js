'use strict';

module.exports  = {
  details : require('./PageDetails.js'),
  search : require('./PageSearch.js'),
  grid : require('./PageGrid.js'),
  scrape : () => {
    return browser.executeScript("return scrape();");
  }
}
