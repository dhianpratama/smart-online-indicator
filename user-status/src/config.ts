export interface IConfig {
    port: number;
    debugLogging: boolean;
    mqttUrl: string;
    redisUrl: string;
}

const config: IConfig = {
    port: +process.env.PORT || 8088,
    debugLogging: process.env.NODE_ENV === "development",
    mqttUrl: process.env.MQTT_URL || "mqtt://localhost:1833",
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};

export { config };
