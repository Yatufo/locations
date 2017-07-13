#### Install Dependencies
* [Node](https://nodejs.org/en/download/)
* [Docker](https://www.docker.com/)

Start Selenium:
```webdriver-manager start```


From the root folder:

```protractor protractor.conf.js [--params.startId=id]```


Import the scraped data:
```
mongoimport -h localhost:27017 --db realestate --collection locations --mode upsert --upsertFields id  --jsonArray data/locations.json
mongoimport -h localhost:27017 --db realestate --collection interests  --jsonArray data/interests.json
```

Create the index:
```
  use realestate
  db.createCollection("locations")
  db.locations.createIndex( { "id": 1 }, { unique: true  } )
  db.locations.createIndex({ "location": "2dsphere"})
```
