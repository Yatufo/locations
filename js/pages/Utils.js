const formattersDefinition = require('./Formatting.js').formattersDefinition

const utils = {
  formatters: formattersDefinition(),
  loadScraper: (scrapeDefinition) => {
    return browser.executeScript(() => {
        $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
        const [scrapeString, formattersString] = arguments;
        window.scrape = eval(scrapeString);
        window.formatters = eval(formattersString)();
      }, scrapeDefinition.toString(), formattersDefinition.toString())
      .then(() => {
        return browser.driver.sleep(4000);
      });
  },
  waitPageLoaded: () => {
    return browser.driver.sleep(500);
  },
  scrapeCurrent: () => {
    return browser.executeScript("return scrape();")
      .catch((e) => {
        console.log("Retrying scraping after error: ", e.message);
        return browser.driver.sleep(1000).then(utils.scrapeCurrent)
      });
  },
  scrapeAll: scrapeAll
}


function processInfo(partial, cumulative, previousFirstId) {
  const [first] = partial;
  const cumulativeIds = cumulative.map((c) => c.id);
  const isNewItems = previousFirstId !== first.id

  if (isNewItems) {
    partial.forEach((item) => {
      if (!cumulativeIds.includes(item.id)) {
        cumulative.push(item)
      } else {
        console.log("Ignoring scraped id:", item.id);
      }
    });
  } else {
    console.log("Ignoring already processed id: " + first.id + ' and trying again');
  }

  return isNewItems;
}

const REFRESH_EVERY_TIMES = 100;
const refreshPage = (page, amount) => {
  if (amount % REFRESH_EVERY_TIMES === 0) {
    console.log("Collecing garbage");
    return browser.executeScript("window.gc();")
    .then(() => browser.driver.sleep(10000))
    .then(page.init)
  }
  return Promise.resolve();
}

function scrapeAll(page, cumulative, limit, currentFirstId) {
  cumulative = cumulative || [];
  return Promise.all([utils.scrapeCurrent(), page.getStatus()])
    .then(([partial, status]) => {
      const [current, total] = status;
      const isProcessed = processInfo(partial, cumulative, currentFirstId);
      const isFinished = current == total || (limit && cumulative.length >= limit);
      console.log("status: ", current, ' / ', total);

      let result = Promise.resolve(cumulative);

      if (isProcessed && !isFinished) {
        const [first] = partial;
        result = refreshPage(page, current)
          .then(page.next)
          .then(() => scrapeAll(page, cumulative, limit, first.id))
      } else if (!isProcessed) {
        result = scrapeAll(page, cumulative, limit, currentFirstId)
      }

      return result;
    })
}


module.exports = utils;
