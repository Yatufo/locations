
function updateCalculatedRatio() {
  // Setting the calculated data
  db.estates.find({}).forEach(function(estate) {
    var valuation = estate.evaluationBuilding + estate.evaluationLot
    var taxes = estate.taxMunicipal + estate.taxSchool;
    var insurance = 0.006 * estate.price;
    var mortgage = 0.046 * estate.price;


    var cashflow = estate.revenue - taxes - insurance - mortgage;
    var yyield = Math.round((cashflow * 100)/ estate.price) || -1;
    var taxRate = (valuation && taxes) ? taxes / valuation : -1;
    var capRate = Math.round((estate.revenue/estate.price) * 100)
    var sinceInDays = Math.round((new Date().getTime() - estate.timestamp) / (24 * 60 * 60 * 1000));

    db.estates.update({_id: estate._id}, {
      $set: { "calculated.capRate": capRate,  "calculated.yield": yyield, "calculated.taxRate" : taxRate,
       "calculated.sinceInDays": sinceInDays
    }
    });
  });
}

db.system.js.save({_id: 'updateCalculatedRatio', value: updateCalculatedRatio});
