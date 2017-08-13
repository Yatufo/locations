const formattersDefinition = () => {
  const formatters = {
    arrayOfThings: (text, pattern) => {
      return text.replace(/\s/g, "").replace(",", "").match(pattern) || [];
    },
    arrayOfFloat: (text) => {
      const floatPattern = /-?\d+(\,|\.)?\d+/g;
      return formatters.arrayOfThings(text, floatPattern).map((t) => parseFloat(t));
    },
    // Converts the values coming as 1'2" 1 feet 2 inches to it's feet value.
    arrayOfFeet: (text) => {
      const feetInchesPattern = /-?\d+\'(\d+\")?/g;
      const feetInches = formatters.arrayOfThings(text, feetInchesPattern);
      return feetInches.map((fi) => {
        const [feets, inches] = formatters.arrayOfInts(fi);
        return feets + (inches ? inches * 0.083 : 0);
      })
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
  };
  return formatters;
}

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
        result = page.next().then(() => scrapeAll(page, cumulative, limit, first.id))
      } else if (!isProcessed) {
        result = scrapeAll(page, cumulative, limit, currentFirstId)
      }

      return result;
    })
}


module.exports = utils;
