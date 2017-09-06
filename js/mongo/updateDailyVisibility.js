
function updateDailyVisibility() {
  // Sat all invisible.
  db.estates.update({}, { $set: { 'calculated.visible': false, 'calculated.recent' : false}}, {multi: true});

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
    var calculated = (updatedEstate.calculated || {})
    var recent = updatedEstate.recent || true;
    updatedEstate.calculated = Object.assign(calculated, { recent : recent, visible : true, lastUpdate : timestamp });

    delete updatedEstate._id
    delete updatedEstate.timestamp
    delete updatedEstate.updated

    db.estates.update({ id : updatedEstate.id}, {$set : updatedEstate, $setOnInsert : {timestamp : timestamp}}, {upsert : true});
  });

  //the rest (found but not updated) will be just visible.
  db.updates.find({ updated : false, timestamp : LAST_BATCH_START})
  .forEach(function(updatedEstate){
    var timestamp = new Date(updatedEstate.timestamp);
    db.estates.update({ id: updatedEstate.id}, { $set: {'calculated.visible': true, 'calculated.lastUpdate' : timestamp }});
  });
}


db.system.js.save({_id: 'updateDailyVisibility',value: updateDailyVisibility});
