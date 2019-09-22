import { Observable } from "rxjs";
import { config } from "./config";
import { PresenceService } from "./services/presence_service";
import { logger } from "./utils/logger";
import { MqttJsClient } from "./utils/mqtt_client";
import { RedisRxClient } from "./utils/redis_client";

const mqttRxClient = new MqttJsClient(config.mqttUrl);
const redisRxClient = new RedisRxClient(config.redisUrl);
const presenceService = new PresenceService(mqttRxClient, redisRxClient);

presenceService.handlePresenceMessage()
    .subscribe(
        () => logger.info("Successfully processed presence message"),
        (error) => logger.warn(`Error processing presence message => \n ${JSON.stringify(error.stack)}`),
    );

// Observable.of({})
//     .delay(5000)
//     .do(() => logger.info("will publish dummy"))
//     .switchMap(() => mqttRxClient.publish("presence", JSON.stringify({ user_id: 2, status: "offline", last_online_type: "login", last_online_time: "2019-09-08 06:27:07.966Z" })))
//     .subscribe(
//         () => logger.info("done publish"),
//         (error) => logger.info("Error publis"),
//      );
