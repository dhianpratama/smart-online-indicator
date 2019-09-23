import * as moment from "moment";
import { Observable } from "rxjs";
import { config } from "../../config";
import { IUser } from "../../models/user";
import { connectRedis } from "../../utils/connect_redis";
import { logger } from "../../utils/logger";
import { IMqttClient, MqttJsClient } from "../../utils/mqtt_client";
import { BaseHandler, Database } from "../base/base_handler";

const postOfflineCheckerHandler = (requestObservable: Observable<any>) => {
    return new BaseHandler(requestObservable)
        .withDatabase(Database.REDIS)
        .withLogic(() => {
            const mqttClient = new MqttJsClient(config.mqttUrl);
            let redisClient;

            return connectRedis()
                .do((client) => redisClient = client)
                .switchMap(() => redisClient.hgetall("user-status"))                        // get all data from user-status
                .map((data) => data || {})                                                  // to handle if result is null/undefined, so it won't crash at next process
                .map((data) => Object.values(data)
                    .map((it) => JSON.parse(it))
                    .filter((it) => filterAbnormalUser(it)))
                .do((users: IUser[]) => logger.info(`Got ${users.length} abnormal users`))
                .switchMap((users: IUser[]) => users.length > 0
                    ? Observable.zip(...users.map((it) =>
                        processAbnormalUser(it, mqttClient, redisClient)))
                    : Observable.of([]))
                .do(() => mqttClient.disconnect());
        })
        .withResponseMessage("Successfully checked")
        .process();
};

const filterAbnormalUser = (user: IUser) => {
    const diff = moment
      .duration(moment()
        .diff(moment(user.last_online_time)))
      .asMinutes();

    return user.status === "online" && diff > config.offlineThresholdInMinutes;
};

const processAbnormalUser = (user: IUser, mqttClient: IMqttClient, redisClient: any) => {
    logger.info(`will process abnormal user => ${JSON.stringify(user)}`);
    return redisClient.hset("user-status", user.user_id, JSON.stringify({ ...user, status: "offline" }))
        .do(() => logger.info(`will notify for user => ${JSON.stringify(user)}`))
        .switchMap(() => notifyUserPresence(user, mqttClient));
};

const notifyUserPresence = (user: IUser, mqttClient: IMqttClient) => {
    return mqttClient.publish(`client/${user.user_id}/presence`, JSON.stringify(user))
        .do(() => logger.info(`notify done for user => ${JSON.stringify(user)}`));
};

export { postOfflineCheckerHandler };
