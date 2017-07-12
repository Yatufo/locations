#### Install Dependencies
* [Node](https://nodejs.org/en/download/)
* [Docker](https://www.docker.com/)

Start Selenium:
```webdriver-manager start```


From the root folder:

```npm start```


Import the scraped data:
```
mongoimport -h localhost:27017 --db realestate --collection estates --mode upsert --upsertFields id  --jsonArray data/estates.json
mongoimport -h localhost:27017 --db realestate --collection interests  --jsonArray data/interests.json
```

Create the index:
```
  use realestate
  db.createCollection("estates")
  db.estates.createIndex( { "id": 1 }, { collation: { unique: true } } )
```

Count by Id:
```
  db.getCollection('estates').count({})
  db.estates.aggregate({ $group :{_id: "$id",  count: { $sum: 1 }}})
```


$('#divWrapperPager > ul > li.next')[0].click();
