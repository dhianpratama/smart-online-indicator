export interface IConfig {
  debugLogging: boolean;
  mqttPort: number;
  redisHost: string;
  redisPort: number;
}

const config: IConfig = {
  debugLogging: process.env.NODE_ENV === "development",
  mqttPort: +process.env.MQTT_PORT || 1833,
  redisHost: process.env.REDIS_HOST || "locahost",
  redisPort: +process.env.REDIS_PORT || 6379,
};

export { config };
