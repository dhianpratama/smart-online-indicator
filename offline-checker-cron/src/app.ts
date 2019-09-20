import axios from "axios";
import { Observable } from "rxjs";
import { config } from "./config";
import { setupAxiosLogging } from "./utils/axios_logging";
import { logger } from "./utils/logger";

// Setup log for every http request
setupAxiosLogging();

const postOfflineChecker = () => {
    return Observable
        .fromPromise(axios.post(`${config.userStatusBaseUrl}/users/status/offline-checker`));
};

Observable
    .interval(config.interval)
    .startWith(0)
    .do(() => logger.info("=== Cron start ==="))
    .switchMap(() => postOfflineChecker())
    .subscribe(
        () => logger.info("*** Cron success ***"),
        (error: Error) => logger.warn(`*** Cron Error *** \n ${JSON.stringify(error.stack)}`),
    );
