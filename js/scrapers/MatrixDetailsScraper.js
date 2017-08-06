module.exports = () => {
  const formatters = {
    arrayOfNumbers: (text) => {
      const floatPattern = /\d+\,?\d+/g;
      return (text.replace(/\s/g, "").replace(",", "").match(floatPattern) || []).map((t) => parseInt(t));
    },
    numberOnly: (text) => {
      const [first] = formatters.arrayOfNumbers(text);
      return first || null;
    },
    dimensions: (text) => {
      const [width, length] = formatters.arrayOfNumbers(text);
      return { width: width, length: length};
    }
  }

  const scrapeDetailsSchema = {
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

  return artoo.scrapeOne('#wrapperTable', scrapeDetailsSchema);
};
