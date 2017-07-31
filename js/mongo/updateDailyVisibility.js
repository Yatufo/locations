
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
  .forEach(function(updatedEstate){
    delete updatedEstate._id
    updatedEstate.calculated = { visible : true};
    updatedEstate.timestamp = new Date(updatedEstate.timestamp);
    db.estates.update({ id : updatedEstate.id}, {$set : estate}, {upsert : true});
  });

  //the rest will be just have the timestamp updated and also its visibility.
  db.updates.find({ updated : false, timestamp : { '$gte': LAST_BATCH_START }})
  .forEach(function(updatedEstate){
    var timestamp = new Date(updatedEstate.timestamp);
    db.estates.update({
      id: updatedEstate.id
    }, {
      $set: {url : updatedEstate.url, 'calculated.visible': true,'timestamp': timestamp}
    });
  });
}


db.system.js.save({_id: 'updateDailyVisibility',value: updateDailyVisibility});
