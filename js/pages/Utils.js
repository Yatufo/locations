'use strict';

const prospects = [];
let currentId = "";

const utils = {
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
  },
  scrape: () => {
    return browser.executeScript("return scrape();");
  },
  scrapeAll: scrapeAll
}

function scrapeAll(page) {
  return utils.scrape().then((results) => afterScraping(results, page))
}

function checkStatus(page) {
  return page.getStatus().then(([total, current]) => {
    console.log("status: ", current, ' / ', total);
    const finished = current === total;
    return finished ? Promise.reject("end of pages") : Promise.resolve(page);
  })
}

function afterScraping(scrapes, page) {
  const [first] = scrapes;
  const infoIsLoaded = currentId !== first.id;
  let nextStep = Promise.resolve(page);

  if (infoIsLoaded) {
    currentId = first.id;
    scrapes.forEach((item) => prospects.push(item));
    nextStep = checkStatus(page).then(page.next);
  } else {
    console.log("Ignoring already processed id: " + first.id + ' and trying again');
  }

  return nextStep.then(() => scrapeAll(page))
    .catch(console.log).then(() => prospects);
}

module.exports = utils;
