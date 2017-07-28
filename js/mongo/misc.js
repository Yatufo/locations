//Count by Id:
db.getCollection('estates').count({})
db.estates.aggregate({
  $group: {
    _id: "$id",
    count: {
      $sum: 1
    }
  }
})

// Setting the calculated data
db.estates.find({}).forEach(function(estate) {

  var calculated = {
    ratio: Math.round((estate.revenue / estate.price) * 100)
  };
  var timestamp = new Date(estate.timestamp);
  db.estates.update({
    _id: estate._id
  }, {
    $set: {
      calculated: calculated,
      timestamp: timestamp
    }
  });
});


// Updating the history from the previous data
db.tmp.find({}).forEach(function(tmp) {
  var history = (tmp.history || [])

  db.estates.update({
    id: tmp.id
  }, {
    $push: {
      history: {
        $each: history
      }
    }
  });
})



// estates close to any interest
db.estates.find({
  'calculated.distances': {
    '$exists': true
  },
  revenue: {
    '$gt': 0
  },
  'units.residential': {
    '$gt': 0
  },
  'units.commercial': 0
});
