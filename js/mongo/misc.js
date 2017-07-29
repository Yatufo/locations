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
