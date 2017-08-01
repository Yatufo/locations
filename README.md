#### Install Dependencies
* [Node](https://nodejs.org/en/download/)
* [Docker](https://www.docker.com/)



## Every Day:
From the root folder:

* Start the runner:
```./runner.sh```


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


Where to get the coordinates
http://www.gps-coordinates.net/
