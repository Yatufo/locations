
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
  db.updates.find({ updated : true, timestamp : LAST_BATCH_START })
  .forEach(function(updatedEstate){
    var timestamp = new Date(updatedEstate.timestamp);
    delete updatedEstate._id
    delete updatedEstate.timestamp
    delete updatedEstate.updated

    updatedEstate.calculated = { visible : true};
    db.estates.update({ id : updatedEstate.id}, {$set : updatedEstate, $setOnInsert : {timestamp : timestamp}}, {upsert : true});
  });

  //the rest will be just have the timestamp updated and also its visibility.
  db.updates.find({ updated : false, timestamp : LAST_BATCH_START})
  .forEach(function(updatedEstate){
    var timestamp = new Date(updatedEstate.timestamp);
    db.estates.update({
      id: updatedEstate.id
    }, {
      $set: {url : updatedEstate.url, updated : false, 'calculated.visible': true,'timestamp': timestamp}
    });
  });
}


db.system.js.save({_id: 'updateDailyVisibility',value: updateDailyVisibility});
