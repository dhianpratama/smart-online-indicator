import { RedisClient } from "redis";
import { Observable } from "rxjs";
import { IRequestData, IValidationItem } from "../../interfaces/common";
import { connectRedis } from "../../utils/connect_redis";
import { BaseHandler, Database } from "../base/base_handler";

interface IParams {
    user_id: string;
}

const validationData: IValidationItem[] = [
    { field: "user_id", message: "user_id is required" },
];

const getUserStatusByIdHandler = (requestObservable: Observable<any>) => {
    return new BaseHandler(requestObservable)
        .withValidation(validationData)
        .withDatabase(Database.REDIS)
        .withLogic((data: IRequestData<IParams>) => {
            const { params } = data;

            return connectRedis()
                .switchMap((rxRedis: any) => rxRedis.hget("user-status", params.user_id))
                .map((result: string) => ({ user_status: JSON.parse(result) }));
        })
        .withResponseData()
        .process();
};

export { getUserStatusByIdHandler };
