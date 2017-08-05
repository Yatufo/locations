#! /bin/sh

#without docker: protractor protractor.conf.js
echo 1. Running the scraper:
#./protractor-headless.sh protractor.conf.js

echo 2.1 Start mongo in case is not running
docker start centrisdb

echo 2.2 Importing the scraped data
mongoimport -h localhost:27017 --db realestate --collection updates \
  --mode upsert --upsertFields id,timestamp  --jsonArray data/updates.json


echo 3. Calculating important data in Mongo:
mongo < ./js/mongo/calculate.js

echo 4. Exporting query to csv:

mongoexport --db realestate --collection estates --type=csv \
--query '{ "calculated.distances": { $exists: true }, price: {$lt: 700000}, revenue: {$gt: 0}, "units.residential": { "$gt": 2 }, "units.commercial": 0, "calculated.visible"  : true}' \
--fieldFile data/exportFields.txt --out data/prospects.csv

echo 5. Rename the csv file titles:
export CURRENT_LABELS=location.coordinates.0,location.coordinates.1,id,price,revenue,calculated.ratio,url,residentialUnits,score,timestamp,calculated.recent

export NEW_LABELS=lat,lon,id,price,revenue,ratio,url,residentialUnits,score,timestamp,recent

sed -e "s/$CURRENT_LABELS/$NEW_LABELS/" data/prospects.csv > data/results/prospects-latest.csv


echo 5. Cleaning up
mv data/updates.json data/results/updates-$(date +%F).json
mv data/grid.json data/results/grid-$(date +%F).json
mv data/prospects.csv data/results/prospects-$(date +%F).csv
