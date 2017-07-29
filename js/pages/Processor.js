const pages = require('./Pages.js');
const fs = require('fs');
const estatesFileName = "data/updates.json";

const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

function saveProspect(prospect, isLastElement) {
  const jsonString = JSON.stringify(prospect, null, 2) + (isLastElement ? '] ' : ', ');
  writer.write(jsonString, (e) => console.log(e ? e : 'saved id:' + prospect.id));
}

function resolveDetails(prospect) {
  return (prospect.updated ?
    pages.details.scrape(prospect.url)
      .then((scraped) => Object.assign(prospect, scraped)) :
    Promise.resolve(prospect));
}

function processProspects(prospects, startTime, isLastGroup) {
  if (prospects.length > 0) {
    const [head, ...tail] = prospects;
    const isLastElement = isLastGroup && tail.length === 0;
    head.timestamp = startTime;

    resolveDetails(head)
      .then((prospect) => saveProspect(prospect, isLastElement))
      .then(() => processProspects(tail, startTime, isLastGroup))
  }
}

module.exports = {
  start: function() {
    return writer.write('[');
  },
  processProspects: processProspects
}
