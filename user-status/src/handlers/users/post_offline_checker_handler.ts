import { Observable } from "rxjs";
import { logger } from "../../infrastructure/logging/logger";
import { connectRedis } from "../../infrastructure/redis/connect_redis";
import { BaseHandler, Database } from "../base/base_handler";

const postOfflineCheckerHandler = (requestObservable: Observable<any>) => {
    return new BaseHandler(requestObservable)
        .withDatabase(Database.REDIS)
        .withLogic(() => {
            return Observable.of({});
        })
        .withResponseMessage("Checking sent")
        .process();
};

export { postOfflineCheckerHandler };
