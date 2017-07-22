#### Install Dependencies
* [Node](https://nodejs.org/en/download/)
* [Docker](https://www.docker.com/)

Start Selenium:
```webdriver-manager start```


From the root folder:

```protractor protractor.conf.js [--params.startId=id]```


Import the scraped data:
```
mongoimport -h localhost:27017 --db realestate --collection estates --mode upsert --upsertFields id  --jsonArray data/estates.json
mongoimport -h localhost:27017 --db realestate --collection interests  --jsonArray data/interests.json
```

Create the index:
```
  use realestate
  db.createCollection("estates")
  db.estates.createIndex( { "id": 1 }, { unique: true  } )
  db.estates.createIndex({ "location": "2dsphere"})
  db.interests.createIndex({ "location": "2dsphere"})
```


Ideas:
Price per ft2
Average price per ft2 in the area
Changed price.


Export query to csv
```
export EXPORTS_QUERY='{ "distances": { "$exists": true }, "revenue": {"$gt": 0}, "units.residential": { "$gt": 0 }, "units.commercial": 0}'

mongoexport --db realestate --collection estates --type=csv --query $EXPORTS_QUERY \
--fieldFile data/exportFields.txt --out data/exports/prospects.csv
```
