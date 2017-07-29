#### Install Dependencies
* [Node](https://nodejs.org/en/download/)
* [Docker](https://www.docker.com/)



## Every Day:
From the root folder:

* Start Selenium:
```webdriver-manager start```

* Run the process:
```protractor protractor.conf.js```

* Import the scraped data:
```
mongoimport -h localhost:27017 --db realestate --collection updates --mode upsert --upsertFields id  --jsonArray data/updates.json
```

* Calculate important data in Mongo:
```
  db.loadServerScripts();
  updateDailyVisibility();
  updateAllEstatesDistances(600);
  updateCalculatedRatio();
```

* Export query to csv:

```
export EXPORTS_QUERY='{ "calculated.distances": { "$exists": true }, "price": {"$lt": 700000}, "revenue": {"$gt": 0}, "units.residential": { "$gt": 2 }, "units.commercial": 0, {visible  : true}, {updated : true}}'

mongoexport --db realestate --collection estates --type=csv --query $EXPORTS_QUERY --fieldFile data/exportFields.txt --out data/exports/new-prospects.csv
```



## Initial Setup:

* Import the interests:
```
mongoimport -h localhost:27017 --db realestate --collection interests  --jsonArray data/interests.json
```

* Load functions' definitions in Mongo:
  * mongo/init.js
  * mongo/updateInterestDistance.js
  * mongo/updateDailyVisibility.js

Ideas:
Price per ft2
Average price per ft2 in the area
Changed price.


TODO:
-Update the updated ones.
-Set visibility false of non existing ones.


Where to get the coordinates
http://www.gps-coordinates.net/
