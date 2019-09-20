import { RedisClient } from "redis";
import { Observable } from "rxjs";
import * as rxRedis from "rxredis";
import { config } from "../../config";

let redisClient;
let rxRedisClient;

export const connectRedis = () => {
    return Observable.defer(() => {
        if (!redisClient) {
            redisClient = new RedisClient({ url: config.redisUrl });
            rxRedisClient = rxRedis(redisClient);
        }

        return Observable.of(rxRedisClient);
    });
};
