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

//remove fields
db.estates.update({}, {
  $unset: {
    coord: "",
    distances: "",
  }
}, {
  multi: true
})

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



/**
  Updates the distances from all points of interest for all the estates.
**/
var MAX_DISTACE = 1000; // One kilometer.
db.interests.aggregate()
  .forEach(function(interest) {
    findEstatesNearBy(interest.location, MAX_DISTACE).results
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


// estates close to any interest
db.estates.find({
  distances: {
    '$exists': true
  }, revenue : { '$gt' : 0 }
}, {
  id: 1,
  price: 1,
  revenue: 1,
  'location.coordinates': 1
}).map(function(estate) {
    estate.url = 'http://www.centris.ca/en/duplex~a-vendre~le-plateau-mont-royal-montreal/' + estate.id;
    estate.ratio = Math.round((estate.revenue / estate.price) * 100);
    return estate;
})
