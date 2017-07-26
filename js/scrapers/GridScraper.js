'use strict';

module.exports = () => {

  const scrapeGridSchema = {
    id: () => {
      return $('div.description a').text();
    },
    updated: () => {
      $('div.thumbnail > a > div.nouvelle-propriete')
    },
    timestamp: () => {
      return new Date().getTime();
    }
  };

  const details = artoo.scrape('#divMainResult', scrapeGridSchema);

  return details
};
