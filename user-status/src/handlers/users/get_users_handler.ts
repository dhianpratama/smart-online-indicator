import { Observable } from "rxjs";
import { logger } from "../../infrastructure/logging/logger";
import { connectRedis } from "../../infrastructure/redis/connect_redis";
import { BaseHandler, Database } from "../base/base_handler";

const getUsersHandler = (requestObservable: Observable<any>) => {
    return new BaseHandler(requestObservable)
        .withDatabase(Database.REDIS)
        .withLogic(() => {
            return connectRedis()
                .switchMap((rxRedis: any) => rxRedis.hgetall("user-status"))
                .do((result) => logger.info(`ALL USERS => \n ${JSON.stringify(result)}`))
                .map((result: string) => {
                    const userStatuses = Object.values(result).map((it) => JSON.parse(it));
                    return {
                        users_statuses: userStatuses,
                    };
                });
        })
        .withResponseData()
        .process();
};

export { getUsersHandler };
