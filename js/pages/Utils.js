const formatters = {
  arrayOfThings: (text, pattern) => {
    return text.replace(/\s/g, "").replace(",", "").match(pattern) || [];
  },
  arrayOfFloat: (text) => {
    const floatPattern = /\d+\.?\d+/g;
    return formatters.arrayOfThings(text, floatPattern).map((t) => parseFloat(t));
  },
  arrayOfInts: (text) => {
    const intPatttern = /\d+/g;
    return formatters.arrayOfThings(text, intPatttern).map((t) => parseInt(t));
  },
  numberOnly: (text) => {
    const [first] = formatters.arrayOfFloat(text);
    return first || null;
  },
  dimensions: (text) => {
    const [width, length] = formatters.arrayOfFloat(text);
    return {
      width: width,
      length: length
    };
  }
}

const utils = {
  formatters: formatters,
  loadScraper: (scrapeDefinition) => {
    return browser.executeScript(() => {
        $('head').append("<script async='false' type='text/javascript' src='https://medialab.github.io/artoo/public/dist/artoo-latest.min.js'/>");
        window.scrape = eval(arguments[0]);
      }, scrapeDefinition.toString())
      .then(() => {
        return browser.driver.sleep(2000);
      });
  },
  waitPageLoaded: () => {
    return browser.driver.sleep(500);
  },
  scrapeCurrent: () => {
    return browser.executeScript("return scrape();");
  },
  scrapeAll: scrapeAll
}


function processInfo(partial, cumulative, previousFirstId) {
  const [first] = partial;
  const cumulativeIds = cumulative.map((c) => c.id);
  const lastPartial = (partial.slice(-1)[0] || {}).id;
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


function scrapeAll(page, cumulative, currentFirstId) {
  cumulative = cumulative || [];
  return Promise.all([utils.scrapeCurrent(), page.getStatus()])
    .then(([partial, status]) => {
      const [current, total] = status;
      const isFinished = current == total;
      const isProcessed = processInfo(partial, cumulative, currentFirstId);
      console.log("status: ", current, ' / ', total);

      let result = Promise.resolve(cumulative);

      if (isProcessed && !isFinished){
        const [first] = partial;
        result = page.next().then(() => scrapeAll(page, cumulative, first.id))
      } else if (!isProcessed){
        result = scrapeAll(page, cumulative, currentFirstId)
      }

      return result;
    })
}


module.exports = utils;
