import * as mosca from "mosca";
import * as redis from "redis";
import { config } from "./config";
import { logger } from "./utils/logger";

const ascoltatore = {
  type: "redis",
  redis,
  db: 12,
  port: config.redisPort,
  return_buffers: true,
  host: config.redisHost,
};

const settings = {
  port: config.mqttPort,
  // backend: ascoltatore,
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
