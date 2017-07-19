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
  db.estates.save(estate);
})

//remove fields
db.estates.update({}, {
  $unset: {
    coord: "",
    distances: "" 
  }
}, {
  multi: true
})

/// Update distances to points of interest.
function updateInterestDistance(interest, nearResult) {
  var id = nearResult.obj._id;
  var distance = nearResult.dis;

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
function findEstatesNearBy(location) {
  return db.runCommand({
    geoNear: "estates",
    near: location,
    spherical: true,
    maxDistance: 1000
  });
}



/**
  Updates the distances from all points of interest for all the estates.
**/
db.interests.aggregate()
  .forEach(function(interest) {
    findEstatesNearBy(interest.location).results
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

// load script to be able to use them in mongo.
db.loadServerScripts();
