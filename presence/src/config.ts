export interface IConfig {
  debugLogging: boolean;
  mqttUrl: string;
  redisUrl: string;
}

const config: IConfig = {
  debugLogging: process.env.NODE_ENV === "development",
  mqttUrl: process.env.MQTT_URL || "mqtt://localhost:1833",
  redisUrl: process.env.REDIS_URL || "redis://locahost:6379",
};

export { config };
