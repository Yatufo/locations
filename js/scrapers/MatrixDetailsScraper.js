module.exports = () => {

  //TODO: Remove duplication by loading all scrapers via the browser like with artoo.
  const formatters = {
    arrayOfFloat: (text) => {
      const floatPattern = /\d+\,?\d+/g;
      return (text.replace(/\s/g, "").replace(",", "").match(floatPattern) || []).map((t) => parseInt(t));
    },
    numberOnly: (text) => {
      const [first] = formatters.arrayOfFloat(text);
      return first || null;
    },
    dimensions: (text) => {
      const [width, depth] = formatters.arrayOfFloat(text);
      return { 'width' : width, 'depth': depth};
    }
  }

  const scrapeDetailsSchema = {
    id : () => getValueFor("Centris® No."),
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

  return [artoo.scrapeOne('#wrapperTable', scrapeDetailsSchema)];
};
