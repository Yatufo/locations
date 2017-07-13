//Count by Id:
db.getCollection('locations').count({})
db.locations.aggregate({
  $group: {
    _id: "$id",
    count: {
      $sum: 1
    }
  }
})

//Searches near one point
db.runCommand({
  geoNear: "locations",
  near: {
    type: "Point",
    coordinates: [45.446248, -73.603927]
  },
  spherical: true,
  maxDistance: 1000
})

//Transform all the data the location field
db.locations.aggregate([{
  $addFields: {
    location: {
      type: "Point",
      coordinates: ["$coord.lon", "$coord.lat"]
    }
  }
}]).forEach(function(estate) {
  db.locations.save(estate);
})

//remove fields
db.locations.update({}, {
  $unset: {
    coord: ""
  }
}, {
  multi: true
})
