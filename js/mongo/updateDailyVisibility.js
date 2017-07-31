
function updateDailyVisibility() {
  // Sat all invisible.
  db.estates.update({}, { $set: { 'calculated.visible': false}}, {multi: true});

  var LAST_BATCH_START = db.updates.aggregate([{
    $group: {
      _id: null,
      timestamp: {
        $max: "$timestamp"
      }
    }
  }]).map(function(o){return o.timestamp})[0];


  // only the estates with updated will be fully updated and visible.
  db.updates.find({ updated : true, timestamp : { '$gte': LAST_BATCH_START }})
  .forEach(function(estate){
    delete estate._id
    estate.calculated = { visible : true};
    estate.timestamp = new Date(estate.timestamp);
    db.estates.update({ id : estate.id}, {$set : estate}, {upsert : true});
  });

  //the rest will be just have the timestamp updated and also its visibility.
  db.updates.find({ updated : false, timestamp : { '$gte': LAST_BATCH_START }})
  .forEach(function(estate){
    var timestamp = new Date(estate.timestamp);
    db.estates.update({
      id: estate.id
    }, {
      $set: {'calculated.visible': true,'timestamp': timestamp}
    });
  });
}


db.system.js.save({_id: 'updateDailyVisibility',value: updateDailyVisibility});
