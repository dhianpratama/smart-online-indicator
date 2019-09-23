export interface IConfig {
  debugLogging: boolean;
  mqttPort: number;
  wsPort: number;
}

const config: IConfig = {
  debugLogging: process.env.NODE_ENV === "development",
  mqttPort: +process.env.MQTT_PORT || 1833,
  wsPort: +process.env.WS_PORT || 1884,
};

export { config };
