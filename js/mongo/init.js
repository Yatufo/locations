use realestate
db.createCollection("estates")
db.estates.createIndex( { id: 1 }, { unique: true  } )
db.estates.createIndex({ location: "2dsphere"})
db.interests.createIndex({ location: "2dsphere"})
db.updates.createIndex( { id: 1 , timestamp : 1 }, { unique: true  } )
