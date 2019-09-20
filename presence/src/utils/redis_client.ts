import { RedisClient } from "redis";
import { Observable } from "rxjs";
import * as rxRedis from "rxredis";

let redisClient;
let rxRedisClient;

export class RedisRxClient {
    private url: string;
    constructor (redisUrl: string) {
        this.url = redisUrl;
    }

    public connectIfNeeded = () => {
        return Observable.defer(() => {
            if (!redisClient) {
                redisClient = new RedisClient({ url: this.url });
                rxRedisClient = rxRedis(redisClient);
            }

            return Observable.of(rxRedisClient);
        });
    }

    public hset = (hash: string, key: string, value: string) => {
        return this.connectIfNeeded()
            .switchMap((client) => client.hset(hash, key, value));
    }

    public hget = (hash: string, key: string) => {
        return this.connectIfNeeded()
            .switchMap((client) => client.hget(hash, key));
    }
}
