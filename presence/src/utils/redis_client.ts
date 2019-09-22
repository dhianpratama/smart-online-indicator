import { RedisClient } from "redis";
import { Observable } from "rxjs";
import * as rxRedis from "rxredis";

let redisClient;
let rxRedisClient;

export class RedisRxClient {

    constructor (private readonly host: string, private readonly port: number) {
    }

    public connectIfNeeded = () => {
        return Observable.defer(() => {
            if (!redisClient) {
                redisClient = new RedisClient({ host: this.host, port: this.port });
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
