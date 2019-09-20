import { Observable } from "rxjs";
import { IUser } from "../models/user";
import { logger } from "../utils/logger";
import { IMqttClient } from "../utils/mqtt_client";

export class PresenceService {

    constructor (readonly mqttRxClient: IMqttClient, readonly redisRxClient: any) {}

    public handlePresenceMessage = (): Observable<any> => {
        let prevUserData: IUser;
        return this.mqttRxClient.subscribe("presence")
            .do(() => logger.info("Subscribed to presence. Waiting for message..."))
            .map((message) => JSON.parse(message))
            .do((user: IUser) => prevUserData = { ...user })
            .switchMap((user: IUser) => this.savePresence(user))
            .switchMap((user: IUser) => prevUserData.status !== user.status
                ? this.mqttRxClient
                    .publish(`client/${user.user_id}/presence`, JSON.stringify(user))
                    .do(() => logger.info("Status changed. Notify presence to others"))
                : Observable.of({}),
            );
    }

    private savePresence = (user: IUser) => {
        return this.redisRxClient.hset("user-status", user.user_id, JSON.stringify(user));
    }

}
