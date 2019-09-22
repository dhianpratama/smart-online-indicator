import { Observable } from "rxjs";
import { connectRedis } from "../../utils/connect_redis";
import { BaseHandler, Database } from "../base/base_handler";

const getUsersHandler = (request$: Observable<any>) => {
    return new BaseHandler(request$)
        .withDatabase(Database.REDIS)
        .withLogic(() => connectRedis()
            .switchMap((rxRedis: any) => rxRedis.hgetall("user-status"))
            .map((result: string) => {
                const userStatuses = Object.values(result).map((it) => JSON.parse(it));
                return {
                    users_statuses: userStatuses,
                };
            }))
        .withResponseData()
        .process();
};

export { getUsersHandler };
