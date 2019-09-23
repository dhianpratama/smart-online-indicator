User-Status
============

API Service to server user-status

Running the service
=================

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
* `OFFLINE_THRESHOLD_IN_MINUTES` (string): How long an idle user will be considered as offline. Value in minutes. Default: `5`


## Endpoints

### 1. `GET /users/status`

Get all users with statuses

Sample response(s):

```
HTTP 200 OK

{
    "status": "success",
    "data": {
        "users_statuses": [
            {
                "user_id": "Sabrina",
                "status": "offline",
                "last_status_type": "login",
                "last_online_time": "2019-08-11T06:03:01.073Z"
            },
            {
                "user_id": "Wenhan",
                "status": "online",
                "last_status_type": "login",
                "last_online_time": "2019-08-11T06:03:01.073Z"
            }
        ]
    }
}
```

### 2. `GET /users/<user_id>/status`

```
Response 200
{
    "status": "success",
    "data": {
        "user_status": {
            "user_id": "Dhian",
            "status": "offline",
            "last_online_type": "online",
            "last_online_time": "2019-09-23T05:47:13.275Z"
        }
    }
}
```


### 3. `POST /users/status/offline-checker`


```
Response 200
{
    "status": "success"
}
```