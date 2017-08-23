
function deleteLastBatch() {

  var LAST_BATCH_START = db.updates.aggregate([{
    $group: {
      _id: null,
      timestamp: {
        $max: "$timestamp"
      }
    }
  }]).map(function(o){return o.timestamp})[0];


  // only the estates with updated will be fully updated and visible.
  db.updates.deleteMany({timestamp : LAST_BATCH_START })
}


db.system.js.save({_id: 'deleteLastBatch',value: deleteLastBatch});
