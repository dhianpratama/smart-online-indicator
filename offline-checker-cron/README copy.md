Denjaka
============

Denjaka is a service for Playgame gamification.

Running the service
=================

## How to run server

`npm run serve`


## Environment variables

Server related:

* `PORT` (int): The port number the guardian will listen to. Default: `8080`.

Database related:

* `MONGO_URL` (string): MongoDB connection string.


## Endpoints

### 1. `GET /ping`

Ensures that the server is alive, though not necessarily ready to accept HTTP traffic.

Sample response(s):

```
HTTP 200 OK

{
    "status": "success",
    "message": "pong"
}
```

### 1. `GET /categories`

```
Request (query string)
{
	"limit": 10,
	"offset": 0
}
```

```
Response 200
{
    "status": "success",
    "data": [
        {
            "name": "Adventure",
            "slug": "adventure",
            "id": "5c189c013e989add8d73f522"
        }
    ]
}
```

### 2. `GET /categories/<category_id>/games/count`

```
Request (query string)
{
	"limit": 10,
	"offset": 0
}
```

```
Response 200
{
    "status": "success",
    "data": {
        "total_games": 0
    }
}
```


### 3. `GET /games/category/<category_id>`

```
Request (query string)
{
	"limit": 10,
	"offset": 0
}
```

```
Response 200
{
    "status": "success",
    "data": [
        {
            "picture": {
                "large": "https://static-assets.playgame.tech/img-default-avatar.png",
                "thumbnail": "https://static-assets.playgame.tech/img-default-avatar.png"
            },
            "slugs": [
                "test",
                "tist"
            ],
            "total_plays": 0,
            "categories": [
                "5c189c013e989add8d73f522"
            ],
            "name": "Test game",
            "caption": "the testing game",
            "description": "this is just for testing purpose only",
            "developer": {
                "display_name": "My dev",
                "website": "https://go.blog",
                "slug": "blog",
                "id": "5c19d6833e989add8d73fed7"
            },
            "id": "5c19cfb53e989add8d73fcdd"
        }
    ]
}
```

### 4. `GET /games/search`

```
Request (query string)
{
	"limit": 10,
	"offset": 0,
  "category_id": "xxx",
  "search": "test"
}
```

```
Response 200
{
    "status": "success",
    "data": [
        {
            "picture": {
                "large": "https://static-assets.playgame.tech/img-default-avatar.png",
                "thumbnail": "https://static-assets.playgame.tech/img-default-avatar.png"
            },
            "slugs": [
                "test",
                "tist"
            ],
            "total_plays": 0,
            "categories": [
                "5c189c013e989add8d73f522"
            ],
            "name": "Test game",
            "caption": "the testing game",
            "description": "this is just for testing purpose only",
            "developer": {
                "display_name": "My dev",
                "website": "https://go.blog",
                "slug": "blog",
                "id": "5c19d6833e989add8d73fed7"
            },
            "id": "5c19cfb53e989add8d73fcdd"
        }
    ]
}
```

### 5. `GET /games/<game_id>`

```
Response 200
{
    "status": "success",
    "data": {
        "picture": {
            "large": "https://static-assets.playgame.tech/img-default-avatar.png",
            "thumbnail": "https://static-assets.playgame.tech/img-default-avatar.png"
        },
        "slugs": [
            "test",
            "tist"
        ],
        "total_plays": 0,
        "categories": [
            "5c189c013e989add8d73f522"
        ],
        "name": "Test game",
        "caption": "the testing game",
        "description": "this is just for testing purpose only",
        "developer": {
            "display_name": "My dev",
            "website": "https://go.blog",
            "slug": "blog",
            "id": "5c19d6833e989add8d73fed7"
        },
        "id": "5c19cfb53e989add8d73fcdd"
    }      
}
```

### 5. `GET /games/slug/<game_slug>`

```
Response 200
{
    "status": "success",
    "data": {
        "picture": {
            "large": "https://static-assets.playgame.tech/img-default-avatar.png",
            "thumbnail": "https://static-assets.playgame.tech/img-default-avatar.png"
        },
        "slugs": [
            "test",
            "tist"
        ],
        "total_plays": 0,
        "categories": [
            "5c189c013e989add8d73f522"
        ],
        "name": "Test game",
        "caption": "the testing game",
        "description": "this is just for testing purpose only",
        "developer": {
            "display_name": "My dev",
            "website": "https://go.blog",
            "slug": "blog",
            "id": "5c19d6833e989add8d73fed7"
        },
        "id": "5c19cfb53e989add8d73fcdd"
    }      
}
```

### 5. `POST /games/<game_id>/play`

```
Response 200
{
    "status": "success"    
}
```