import { Observable } from "rxjs";
import { connectRedis } from "../../utils/connect_redis";
import { logger } from "../../utils/logger";
import { BaseHandler, Database } from "../base/base_handler";

const getUsersHandler = (requestObservable: Observable<any>) => {
    return new BaseHandler(requestObservable)
        .withDatabase(Database.REDIS)
        .withLogic(() => {
            return connectRedis()
                .switchMap((rxRedis: any) => rxRedis.hgetall("user-status"))
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
