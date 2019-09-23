Presence
============

Service to consume presence data from MQTT. Then update the data to redis.


## How to run server

Development Mode
```
npm install
npm run start
```

Production mode
```
npm install
npm run serve
```


## Environment variables

* `NODE_ENV` (string): Environment mode. Default: `development`
* `PORT` (int): The port number the service will listen to. Default: `8080`
* `MQTT_URL` (string): MQTT connection string. Default: `mqtt://localhost:1833`
* `REDIS_HOST` (string): Redis host. Default: `localhost`
* `REDIS_PORT` (int): Redis port. Default: `6379`
