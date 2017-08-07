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
    return { width: width, length: length};
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


const prospects = [];
const prospectIds = [];
let currentId = "";

function afterScraping(results, status, page) {
  const [current, total] = status;
  const notFinished = current < total;
  const [first] = results;
  const infoIsLoaded = currentId !== first.id;

  if (infoIsLoaded) {
    currentId = first.id;
    results.forEach((item) => {
      if (!prospectIds.includes(item.id)) {
        prospects.push(item)
        prospectIds.push(item.id);
      } else {
        console.log("Ignoring scraped id:", item.id);
      }
    });

    console.log("status: ", current, ' / ', total);
    return (notFinished ? page.next().then(() => scrapeAll(page)) : Promise.resolve(prospects));
  } else {
    console.log("Ignoring already processed id: " + first.id + ' and trying again');
    return scrapeAll(page);
  }
}

function scrapeAll(page) {
  return Promise.all([utils.scrapeCurrent(), page.getStatus()])
    .then(([results, status]) => afterScraping(results, status, page));
}


module.exports = utils;
