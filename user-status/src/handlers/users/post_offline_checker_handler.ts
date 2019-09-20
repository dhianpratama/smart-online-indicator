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
                .switchMap(() => redisClient.hgetall("user-status"))
                .map((data) => Object.values(data)
                    .map((it) => JSON.parse(it))
                    .filter((it) => filterAbnormalUser(it)))
                .do((users: IUser[]) => logger.info(`Got ${users.length} abnormal users`))
                .switchMap((users: IUser[]) => Observable
                    .zip(...users.map((it) => processAbnormalUser(it, mqttClient, redisClient))))
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
    console.log("process")
    return redisClient.hset("user-status", user.user_id, JSON.stringify(user))
        .switchMap(() => notifyUserPresence(user, mqttClient));
};

const notifyUserPresence = (user: IUser, mqttClient: IMqttClient) => {
    console.log("notify")
    return mqttClient.publish(`client/${user.user_id}/presence`, JSON.stringify(user));
};

export { postOfflineCheckerHandler };
