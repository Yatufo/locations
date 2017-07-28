
/***
 * Updates the distances from all points of interest for all the estates.
**/
// load script to be able to use them in mongo.
function updateAllEstatesDistances(distance) {

  //remove the previous calculated distances.
  db.estates.update({}, { $unset: { 'calculated.distances': ""}}, {multi: true});

  db.interests.aggregate()
    .forEach(function(interest) {
      findEstatesNearBy(interest.location, distance).results
        .forEach(function(result) {
          updateInterestDistance(interest, result)
        });
    })
}
/***
 * Searches all the estates near one point
 *   location is a mongo point, example:
 *   {
 *     type: "Point",
 *     coordinates: [45.446248, -73.603927]
 *   }
**/
function findEstatesNearBy(location, maxDistance) {
  return db.runCommand({
    geoNear: "estates",
    near: location,
    spherical: true,
    maxDistance: maxDistance
  });
}


/// Update distances to points of interest.
function updateInterestDistance(interest, nearResult) {
  var id = nearResult.obj._id;
  var distance = Math.round(nearResult.dis);

  return db.estates.update({
    _id: id
  }, {
    $push: {
      'calculated.distances': {
        distance: distance,
        interest: interest
      }
    }
  });
}


//register functions in mongo
db.system.js.save({_id: 'findEstatesNearBy',value: findEstatesNearBy});
db.system.js.save({_id: 'updateInterestDistance', value: updateInterestDistance});
db.system.js.save({_id: 'updateAllEstatesDistances', value: updateAllEstatesDistances});
