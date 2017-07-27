'use strict';


module.exports = {
  loadScraper: (scrapeDefinition) => {
    return browser.executeScript(() => {
        $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
        window.scrape = eval(arguments[0]);
      }, scrapeDefinition.toString())
      .then(() => {
        return browser.driver.sleep(3000);
      });
  },
  waitPageLoaded: () => {
    return waitFor('#ButtonViewThumbnail');
  }
}