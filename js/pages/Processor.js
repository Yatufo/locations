const pages = require('./Pages.js');
const fs = require('fs');
const estatesFileName = "data/updates.json";

const writer = fs.createWriteStream(estatesFileName, {
  flags: 'a',
  defaultEncoding: 'utf8'
});

const startTime = new Date().getTime();

function saveProspect(prospect) {
  prospect.timestamp = startTime;

  const jsonString = JSON.stringify(prospect, null, 2) + ', ';
  writer.write(jsonString, (e) => console.log(e ? e : 'saved id:' + prospect.id));
}

function processProspects(prospects) {
  if (prospects.length > 0) {
    const [head, ...tail] = prospects;

    (head.updated ? pages.details.scrape(head.url) : Promise.resolve({}))
    .then((scraped) => saveProspect(Object.assign(head, scraped)))
      .then(() => processProspects(tail))
  }
}

module.exports = {
  processProspects: processProspects
}
