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

//Searches near one point
db.runCommand({
  geoNear: "estates",
  near: {
    type: "Point",
    coordinates: [45.446248, -73.603927]
  },
  spherical: true,
  maxDistance: 1000
})

//Transform all the data the location field
db.estates.aggregate([{
      $unset: { < field1 >: ""
        $addFields: {
          location: {
            type: "Point",
            coordinates: ["$coord.lon", "$coord.lat"]
          }
        }
      }]).forEach(function(estate) {
      db.estates.save(estate);
    })
