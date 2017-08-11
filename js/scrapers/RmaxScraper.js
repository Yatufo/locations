module.exports = () => {

  const scrapeDetailsSchema = {
    id : () => {
      return formatters.numberOnly($('p.property-uls').text()).toString();
    },
    taxMunicipal: () => getValueFor("Municipal", formatters.numberOnly),
    taxSchool: () => getValueFor("School", formatters.numberOnly),
    dimensionsBuilding: () => getValueFor("Size", formatters.arrayOfFeet, "dt"),
    dimensionsLot: () => getValueFor("Lot size", formatters.arrayOfFeet, "dt"),
    evaluationLot: () => getValueFor("Lot assessment", formatters.numberOnly),
    evaluationBuilding: () => getValueFor("Building assessment", formatters.numberOnly),
    insurance: () => getValueFor("Insurance", formatters.numberOnly),
    otherExpenses: () => getValueFor("Other", formatters.numberOnly)
  }

  function getValueFor(name, format, preselector) {
    preselector = preselector ? preselector : 'td';
    const text = $(preselector + ':contains("' + name + '"):not(:has(table))').next().text();
    return (format ? format(text) : text);
  }

  return [artoo.scrapeOne('div', scrapeDetailsSchema)];
};
