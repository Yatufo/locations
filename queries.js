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

//Transform all the data the location field
db.estates.aggregate([{
  $addFields: {
    location: {
      type: "Point",
      coordinates: ["$coord.lon", "$coord.lat"]
    }
  }
}]).forEach(function(estate) {
  estate.ratio = Math.round((estate.revenue / estate.price) * 100);
  db.estates.save(estate);
})

// Transforming the old way
db.estates.find({}).map(function(estate) {
  estate.calculated = {
    url: 'http://www.centris.ca/en/duplex~a-vendre~le-plateau-mont-royal-montreal/' + estate.id,
    ratio: Math.round((estate.revenue / estate.price) * 100)
  };
  db.estates.save(estate);
  return estate;
})


//remove fields
db.estates.update({}, {
  $unset: {
    coord: "",
    distances: "",
  }
}, {
  multi: true
})

/**
  Updates the distances from all points of interest for all the estates.
**/
db.interests.aggregate()
  .forEach(function(interest) {
    findEstatesNearBy(interest.location, 1000).results
      .forEach(function(result) {
        updateInterestDistance(interest, result)
      });
  })


//register functions in mongo
db.system.js.save({
  _id: 'findEstatesNearBy',
  value: findEstatesNearBy
})
db.system.js.save({
  _id: 'updateInterestDistance',
  value: updateInterestDistance
});


/// Update distances to points of interest.
function updateInterestDistance(interest, nearResult) {
  var id = nearResult.obj._id;
  var distance = Math.round(nearResult.dis);

  return db.estates.update({
    _id: id
  }, {
    $push: {
      distances: {
        distance: distance,
        interest: interest
      }
    }
  });
}


/***
Searches all the estates near one point
  location is a mongo point, example:
  {
    type: "Point",
    coordinates: [45.446248, -73.603927]
  }
**/
function findEstatesNearBy(location, maxDistance) {
  return db.runCommand({
    geoNear: "estates",
    near: location,
    spherical: true,
    maxDistance: maxDistance
  });
}


// load script to be able to use them in mongo.
db.loadServerScripts();


// estates close to any interest
db.estates.find({
  distances: {
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
