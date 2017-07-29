const pages = require('./Pages.js');
const fs = require('fs');
const estatesFileName = "data/updates.json";

const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

const startTime = new Date().getTime();
writer.write('[');

function saveProspect(prospect, isLast) {
  prospect.timestamp = startTime;

  const jsonString = JSON.stringify(prospect, null, 2) + (isLast ? '] ' :', ') ;
  writer.write(jsonString, (e) => console.log(e ? e : 'saved id:' + prospect.id));
}

function processProspects(prospects) {
  if (prospects.length > 0) {
    const [head, ...tail] = prospects;
    const isLast = tail.length === 0;

    (head.updated ? pages.details.scrape(head.url) : Promise.resolve({}))
    .then((scraped) => saveProspect(Object.assign(head, scraped), isLast))
      .then(() => processProspects(tail))
  }
}

module.exports = {
  processProspects: processProspects
}
