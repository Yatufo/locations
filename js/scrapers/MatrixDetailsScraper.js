"use strict";
const formatters = require('./ScrapeUtils.js').formatters;

module.exports = () => {

  scrapeDetailsSchema = {
    taxMunicipal: () => getValueFor("Municipal Taxes", formatters.numberOnly),
    taxSchool: () => getValueFor("School Taxes", formatters.numberOnly),
    dimensionsBuilding: () => getValueFor("Building Size", formatters.dimensions),
    dimensionsLot: () => getValueFor("Lot Size", formatters.dimensions),
    evaluationLot: () => getValueFor("Lot Assessment", formatters.numberOnly),
    evaluationBuilding: () => getValueFor("Building Assessment", formatters.numberOnly),
    otherExpenses: () => getValueFor("Other", formatters.numberOnly)
  }

  function getValueFor(name, format) {
    const text = $('td:contains("' + name + '"):not(:has(table))').next().text();
    return (format ? format(text) : text);
  }

  artoo.scrapeOne('#wrapperTable', scrapeDetailsSchema);
};
