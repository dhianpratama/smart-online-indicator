import * as cors from "@koa/cors";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as helmet from "koa-helmet";
import * as koaLogger from "koa-logger";
import * as mongoose from "mongoose";
import graceful from "node-graceful";

import { config } from "./config";
import { logger } from "./infrastructure/logging/logger";
import { router } from "./routes";

const run = () => {
    const app = new Koa();

    // Provides important security headers to make your app more secure
    app.use(helmet());

    // Enable cors with default options
    app.use(cors());

    // Logger middleware
    app.use(koaLogger());

    // Enable bodyParser with default options
    app.use(bodyParser());

    // include middleware to respond with "Method Not Allowed - 405".
    app.use(router.routes()).use(router.allowedMethods());

    const server = app.listen(config.port, () => logger.info(`Server running on port ${config.port}`));

    graceful.on("exit", (done) => {
        logger.info("Gracefully exit. Bye...");
        done();
    });

};

run();
