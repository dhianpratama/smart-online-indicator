Smart Online Indicator
============

A microservice based for user online indicator. Features included
- Real time status update
- Last online status


## How to run server
```
docker-compose build
docker-compose up -d
```

## Design Flow

![Image of Design Flow]
(https://github.com/dhianpratama/smart-online-indicator/blob/master/diagrams/Online%20Indicator%20using%20MQTT.png?raw=true)

## Environment Variables
All environment variables that is currently set can be seen in `docker-compose.yml`

```
version: '3.1'

services:

  redis:
    image: redis
    container_name: redis
    restart: always
    volumes:
      - redis:/data

  mosca-broker:
    build:
      context: mosca-broker/.
      dockerfile: docker/Dockerfile
    container_name: mosca-broker
    environment:
      - "NODE_ENV=production"
      - "MQTT_PORT=1833"
      - "WS_PORT=1884"
    restart: always
    ports:
      - 1833:1833
      - 1884:1884

  presence:
    build:
      context: presence/.
      dockerfile: docker/Dockerfile
    container_name: presence
    environment:
      - "NODE_ENV=production"
      - "MQTT_URL=mqtt://mosca-broker:1833"
      - "REDIS_URL=redis://redis:6379"
      - "REDIS_HOST=redis"
      - "REDIS_PORT=6379"
    restart: always

  user-status:
    build:
      context: user-status/.
      dockerfile: docker/Dockerfile
    container_name: user-status
    ports:
      - 8080:8080
    environment:
      - "NODE_ENV=production"
      - "PORT=8080"
      - "MQTT_URL=mqtt://mosca-broker:1833"
      - "REDIS_URL=redis://redis:6379"
      - "REDIS_HOST=redis"
      - "REDIS_PORT=6379"
      - "OFFLINE_THRESHOLD_IN_MINUTES=2"
    restart: always
  
  offline-checker-cron:
    build:
      context: offline-checker-cron/.
      dockerfile: docker/Dockerfile
    container_name: offline-checker-cron
    environment:
      - "NODE_ENV=production"
      - "INTERVAL=60000"
      - "USER_STATUS_BASE_URL=http://user-status:8080"
    restart: always
  
  client-sample:
    build:
      context: client-sample/.
      dockerfile: docker/Dockerfile
    container_name: client-sample
    ports:
      - 80:80
    restart: always

volumes:
  redis:

```