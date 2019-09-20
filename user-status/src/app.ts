import * as cors from "@koa/cors";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as helmet from "koa-helmet";
import * as koaLogger from "koa-logger";

import { config } from "./config";
import { router } from "./routes";
import { logger } from "./utils/logger";

const run = () => {
    // Koa Http Server
    const app = new Koa();
    app.use(helmet());
    app.use(cors());
    app.use(koaLogger());
    app.use(bodyParser());
    app.use(router.routes()).use(router.allowedMethods());
    app.listen(config.port, () => logger.info(`Server running on port ${config.port}`));
};

run();
