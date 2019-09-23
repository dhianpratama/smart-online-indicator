Offline Checker Cron
============

Cronjob to call API /users/status/offline-checker


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
* `INTERVAL` (int): Cronjob interval. In miliseconds. Default: `300000 (5 mins)`
* `USER_STATUS_BASE_URL` (string): Api base url to call: `http://localhost:8080`
