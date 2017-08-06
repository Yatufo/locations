"use strict";
const formatters = require('./ScrapeUtils.js').formatters;



module.exports = () => {
  scrapeDetailsSchema = {
    taxMunicipal: () => getTextBeside("Taxes municipales", formatters.numberOnly),
    taxSchool: () => getTextBeside("Taxe scolaire", formatters.numberOnly),
    dimensionsBuilding: () => getTextBeside("Dimensions du bâtiment", formatters.dimensions),
    dimensionsLot: () => getTextBeside("Dimensions du terrain", formatters.dimensions),
    evaluationLot: () => getTextBeside("Évaluation du terrain", formatters.numberOnly),
    evaluationBuilding: () => getTextBeside("Évaluation du bâtiment", formatters.numberOnly),
    otherExpenses: () => getTextBeside("Autres", formatters.numberOnly)
  }

  function getTextBeside(name, format) {
    const text = $('td:contains("' + name + '"):not(:has(table))').next().text();
    return (format ? format(text) : text);
  }

  const details = artoo.scrapeOne('#wrapperTable', scrapeDetailsSchema);
};
