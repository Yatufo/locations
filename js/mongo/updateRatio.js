
function updateCalculatedRatio() {
  // Setting the calculated data
  db.estates.find({}).forEach(function(estate) {
    var valuation = estate.evaluationBuilding + estate.evaluationLot
    var taxes = estate.taxMunicipal + estate.taxSchool;
    var insurance = 0.006 * estate.price;


    var cashflow = estate.revenue - taxes - insurance;
    var yyield = Math.round((cashflow * 100)/ estate.price) || -1;
    var taxRate = (valuation && taxes) ? taxes / valuation : -1;
    var capRate = Math.round((estate.revenue/estate.price) * 100)

    db.estates.update({_id: estate._id}, {
      $set: { "calculated.capRate": capRate,  "calculated.yield": yyield, "calculated.taxRate" : taxRate}
    });
  });
}

db.system.js.save({_id: 'updateCalculatedRatio', value: updateCalculatedRatio});
