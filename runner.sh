#! /bin/sh

# without docker: protractor protractor.conf.js
echo 1. Running the scraper:
./protractor-headless.sh protractor.conf.js

echo 2. Importing the scraped data
mongoimport -h localhost:27017 --db realestate --collection updates --mode upsert --upsertFields id,timestamp  --jsonArray data/updates.json


echo 3. Calculating important data in Mongo:
mongo < ./js/mongo/calculate.js

echo 4. Exporting query to csv:

export EXPORTS_QUERY='{ "calculated.distances": { "$exists": true }, "price": {"$lt": 700000}, "revenue": {"$gt": 0}, "units.residential": { "$gt": 2 }, "units.commercial": 0, "calculated.visible"  : true}'

mongoexport --db realestate --collection estates --type=csv --query $EXPORTS_QUERY --fieldFile data/exportFields.txt --out data/exports/prospects.csv


echo 5. Cleaning up
rm data/updates.json
rm data/grid.json
