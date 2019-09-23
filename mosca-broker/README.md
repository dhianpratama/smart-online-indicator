User-Status
============

MQTT Broker using Mosca


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
* `MQTT_PORT` (int): Port that will be opened for MQTT connection. Default: `1833`
* `WS_PORT` (int): Port that will be opened for MQTT over Websocket connection. Default: `1884`
