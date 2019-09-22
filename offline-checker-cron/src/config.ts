export interface IConfig {
    debugLogging: boolean;
    interval: number;
    userStatusBaseUrl: string;
}

const config: IConfig = {
    debugLogging: process.env.NODE_ENV === "development",
    interval: +process.env.INTERVAL || 5 * 60 * 1000,
    userStatusBaseUrl: process.env.USER_STATUS_BASE_URL || "http://localhost:8080",
};

export { config };
