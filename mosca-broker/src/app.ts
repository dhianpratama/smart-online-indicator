import * as mosca from "mosca";
import * as redis from "redis";
import { config } from "./config";
import { logger } from "./utils/logger";

const settings = {
  port: config.mqttPort,
};

const server = new mosca.Server(settings);

server.on("clientConnected", (client) => {
  logger.info(`Client connected => ${client.id}`);
});

server.on("published", (packet, client) => {
  logger.info(`Message published =>
    ${JSON.stringify(packet)}`,
  );
});

server.on("ready", setup);

function setup () {
  logger.info("=== Mosca server is running ===");
}
