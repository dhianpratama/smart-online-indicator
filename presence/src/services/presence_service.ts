import { Observable } from "rxjs";
import { IUser } from "../models/user";
import { logger } from "../utils/logger";
import { IMqttClient } from "../utils/mqtt_client";

export class PresenceService {

    constructor (readonly mqttRxClient: IMqttClient, readonly redisRxClient: any) {}

    public handlePresenceMessage = (): Observable<any> => {
        return this.mqttRxClient.subscribe("presence")
            .do(() => logger.info("Subscribed to presence. Waiting for message..."))
            .map((message) => JSON.parse(message))
            .switchMap((user: IUser) => this.savePresence(user))
            .switchMap((user: IUser) => this.getUserFromDb(user.user_id)
                .map((prevUser) => [prevUser, user]))
            .do((data: IUser[]) => {
                const [ prevUser, user ] = data;
                logger.info(`Prev user => ${JSON.stringify(prevUser)}`);
                logger.info(`Current user => ${JSON.stringify(user)}`);
            })
            .switchMap((data: IUser[]) => {
                const [ prevUser, user ] = data;
                return prevUser.status !== user.status
                    ? this.mqttRxClient
                        .publish(`client/${user.user_id}/presence`, JSON.stringify(user))
                        .do(() => logger.info("Status changed. Notify presence to others"))
                    : Observable.of({});
            });
    }

    private savePresence = (user: IUser): Observable<any> => {
        return this.redisRxClient.hset("user-status", user.user_id, JSON.stringify(user))
            .map(() => user);
    }

    private getUserFromDb = (userId: string): Observable<any> => {
        return this.redisRxClient.hget("user-status", userId)
            .map((result: string) => JSON.parse(result));
    }

}
