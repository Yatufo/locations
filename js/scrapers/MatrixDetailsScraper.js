module.exports = () => {

  const scrapeDetailsSchema = {
    id : () => getValueFor("Centris® No."),
    taxMunicipal: () => getValueFor("Municipal Taxes", formatters.numberOnly),
    taxSchool: () => getValueFor("School Taxes", formatters.numberOnly),
    dimensionsBuilding: () => getValueFor("Building Size", formatters.arrayOfFloat),
    dimensionsLot: () => getValueFor("Lot Size", formatters.arrayOfFloat),
    evaluationLot: () => getValueFor("Lot Assessment", formatters.numberOnly),
    evaluationBuilding: () => getValueFor("Building Assessment", formatters.numberOnly),
    otherExpenses: () => getValueFor("Other", formatters.numberOnly)
  }

  function getValueFor(name, format) {
    const text = $('td:contains("' + name + '"):not(:has(table))').next().text();
    return (format ? format(text) : text);
  }

  return [artoo.scrapeOne('#wrapperTable', scrapeDetailsSchema)];
};
