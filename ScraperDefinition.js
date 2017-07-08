'use strict';

function scrapeDetails() {
  const getRowSelector = (name) => {
    return {
      sel: 'tr:contains("' + name + '") td.last-child',
      method: 'text'
    };
  };

  return artoo.scrape('#overview div.description', {
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
    revenu: getRowSelector("Potential gross revenue"),
    usage: getRowSelector("Use of property"),
    style: getRowSelector("Building style"),
    year: getRowSelector("Year built"),
    areaLot: getRowSelector("Lot area"),
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
        const coords = mapUrl.match(pattern);
        return result = {
          lon: coords[0],
          lat: coords[1]
        };
      }
      return {};
    }
  });
};

module.exports = {
  scrapeDetails: scrapeDetails
}
