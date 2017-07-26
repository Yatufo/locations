'use strict';

const scrapeGrid = () => {

  const scrapeGridSchema = {
    id: () => {
      return $('#MlsNumber').text();
    },
    timestamp: () => {
      return new Date().getTime();
    }
  };

  const details = artoo.scrapeOne('#overview div.description', scrapeGridSchema);

  return details
};

module.exports = {
  scrapeGrid: scrapeGrid
}
