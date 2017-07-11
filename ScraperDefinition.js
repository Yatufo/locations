'use strict';

function scrapeDetails() {

  const scrapeDetailsSchema = {
    id: () => {
      return $('#MlsNumber').text();
    },
    score: {
      sel: 'div.walkscore',
      method: 'text'
    },
    address: {
      sel: 'div.address > h2',
      method: 'text'
    },
    price: {
      sel: '#BuyPrice',
      attr: 'content'
    },
    revenue: getRowSelector("Potential gross revenue"),
    usage: getRowSelector("Use of property"),
    style: getRowSelector("Building style"),
    year: getRowSelector("Year built"),
    area: getRowSelector("Lot area"),
    parking: getRowSelector("Parking"),
    fireplace: getRowSelector("Fireplace/Stove"),
    units: getRowSelector("Number of units"),
    residentialUnits: getRowSelector("Residential units"),
    mainUnit: getRowSelector("Main unit"),
    features: getRowSelector("Additional features"),
    coord: () => {
      const pattern = /-?\d+\.\d+/g;
      const mapUrl = $('li.onmap a').attr('onclick');
      if (mapUrl) {
        const coords = mapUrl.match(pattern) || {};
        return result = {
          lon: parseFloat(coords[0]),
          lat: parseFloat(coords[1])
        };
      }
      return {};
    }
  };


  function getRowSelector(name){
    return {
      sel: 'tr:contains("' + name + '") td.last-child',
      method: 'text'
    };
  };

  function getNumberOnly(formattedString){
    const floatPattern = /\d+\,\d+/g;
    const numbersFound = formattedString.match(floatPattern) || [];
    return (numbersFound.length > 0) ? parseFloat(numbersFound[0].replace(',', '')) : null;
  };

  return artoo.scrape('#overview div.description', scrapeDetailsSchema)
  .map((details) => {
    details.score = parseInt((details.score || '0').trim());
    details.area = getNumberOnly(details.area);
    details.revenue = getNumberOnly(details.revenue);
    details.year = getNumberOnly(details.year);

    return details
  })[0];
};

module.exports = {
  scrapeDetails: scrapeDetails
}
