export interface IConfig {
  debugLogging: boolean;
  mqttPort: number;
}

const config: IConfig = {
  debugLogging: process.env.NODE_ENV === "development",
  mqttPort: +process.env.MQTT_PORT || 1833,
};

export { config };
