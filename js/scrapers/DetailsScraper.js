module.exports = () => {
  const floatPattern = /\d+\.?\d+/g;
  const formatters = {
    arrayOfNumbers: (text) => {
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
    }
  };


  function getRowSelector(name) {
    return {
      sel: 'tr:contains("' + name + '") td.last-child',
      method: 'text'
    };
  };

  const details = artoo.scrapeOne('#overview div.description', scrapeDetailsSchema);
  details.score = formatters.numberOnly(details.score);
  details.area = formatters.numberOnly(details.area);
  details.revenue = formatters.numberOnly(details.revenue);
  details.year = formatters.numberOnly(details.year);
  details.price = formatters.numberOnly(details.price);


  const integerPattern = /\d+/g;
  const numbersFound = details.units.match(integerPattern) || [];
  details.units = {
    residential: numbersFound[0] ? parseInt(numbersFound[0]) : 0,
    commercial: numbersFound[1] ? parseInt(numbersFound[1]) : 0
  }

  return details;
};
