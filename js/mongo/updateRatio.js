
function updateCalculatedRatio() {
  // Setting the calculated data
  db.estates.find({}).forEach(function(estate) {
    var ratio = Math.round((estate.revenue / estate.price) * 100)

    db.estates.update({_id: estate._id}, {
      $set: { 'calculated.ratio': ratio }
    });
  });
}




db.system.js.save({_id: 'updateCalculatedRatio', value: updateCalculatedRatio});
