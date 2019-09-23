export interface IConfig {
    port: number;
    debugLogging: boolean;
    mqttUrl: string;
    redisUrl: string;
    redisHost: string;
    redisPort: number;
    offlineThresholdInMinutes: number;
}

const config: IConfig = {
    port: +process.env.PORT || 8080,
    debugLogging: process.env.NODE_ENV === "development",
    mqttUrl: process.env.MQTT_URL || "mqtt://localhost:1833",
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    redisHost: process.env.REDIS_HOST || "localhost",
    redisPort: +process.env.REDIS_PORT || 6379,
    offlineThresholdInMinutes: +process.env.OFFLINE_THRESHOLD_IN_MINUTES || 5,
};

export { config };
