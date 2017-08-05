#! /bin/sh

echo 1. Start mongo
docker run --name centrisdb  -p 27017:27017  -d mongo

echo 2. Importing interests:
mongoimport -h localhost:27017 --db realestate --collection interests --mode upsert --upsertFields name --jsonArray data/interests.json

echo 3. Setup mongo schema
mongo < ./js/mongo/init.js
mongo < ./js/mongo/updateEstatesDistances.js
mongo < ./js/mongo/updateDailyVisibility.js
mongo < ./js/mongo/updateEstatesDistances.js
