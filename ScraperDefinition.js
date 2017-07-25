'use strict';

const scrapeDetails = () => {

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
    location: () => {
      const pattern = /-?\d+\.\d+/g;
      const mapUrl = $('li.onmap a').attr('onclick');
      if (mapUrl) {
        const coords = mapUrl.match(pattern) || {};
        return {
          type: "Point",
          coordinates: [parseFloat(coords[0]), parseFloat(coords[1])]
        }
      }
      return {};
    },
    timestamp: () => {
      return new Date().getTime();
    }
  };


  function getRowSelector(name) {
    return {
      sel: 'tr:contains("' + name + '") td.last-child',
      method: 'text'
    };
  };

  function getNumberOnly(formattedString) {
    const floatPattern = /\d+\,?\d+/g;
    const numbersFound = formattedString.match(floatPattern) || [];
    return (numbersFound.length > 0) ? parseFloat(numbersFound[0].replace(',', '')) : null;
  };

  const details = artoo.scrapeOne('#overview div.description', scrapeDetailsSchema);
  details.score = parseInt((details.score || '0').trim());
  details.area = getNumberOnly(details.area);
  details.revenue = getNumberOnly(details.revenue);
  details.year = getNumberOnly(details.year);
  details.price = getNumberOnly(details.price);


  const integerPattern = /\d+/g;
  const numbersFound = details.units.match(integerPattern) || [];
  details.units = {
    residential: numbersFound[0] ? parseInt(numbersFound[0]) : 0,
    commercial: numbersFound[1] ? parseInt(numbersFound[1]): 0
  }

  return details
};

module.exports = {
  scrapeDetails: scrapeDetails
}
