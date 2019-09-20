import { RedisClient } from "redis";
import { Observable } from "rxjs";
import { connectRedis } from "../../infrastructure/redis/connect_redis";
import { IRequestData, IValidationItem } from "../../interfaces/common";
import { BaseHandler, Database } from "../base/base_handler";

interface IParams {
    user_id: string;
    status: string;
    last_status_type: string;
    last_online_time: Date;
}

const validationData: IValidationItem[] = [
    { field: "user_id", message: "user_id is required" },
    { field: "status", message: "status is required" },
    { field: "last_status_type", message: "last_status_type is required" },
    { field: "last_online_time", message: "last_online_time is required" },
];

const postUserHandler = (requestObservable: Observable<any>) => {
    return new BaseHandler(requestObservable)
        .withValidation(validationData)
        .withDatabase(Database.REDIS)
        .withLogic((data: IRequestData<IParams>) => {
            const { params } = data;

            return connectRedis()
                .switchMap((rxRedis: any) => rxRedis.hset("user-status", params.user_id, JSON.stringify(params)))
                .map((result: string) => result);
        })
        .withResponseMessage("User status successfully saved")
        .process();
};

export { postUserHandler };
