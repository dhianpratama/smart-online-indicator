import * as mqtt from "mqtt";
import { BehaviorSubject, Observable, Subscriber } from "rxjs";
import { logger } from "./logger";

export enum MqttClientStatus {
    Idle,
    Connecting,
    Connected,
    Disconnected,
}

export interface IMqttClient {
    connect (host: string, username?: string, password?: string): Observable<void>;
    subscribe (topic: string): Observable<string>;
    publish (topic: string, message: string): Observable<any>;
    getStatuses (): Observable<MqttClientStatus>;
}

type Topic = string;
type Message = string;

export class MqttJsClient implements IMqttClient {
    private nativeMqttClient?: mqtt.MqttClient;
    private messages?: Observable<[Topic, Message]>;
    private host: string;
    private username?: string;
    private password?: string;
    private readonly statuses = new BehaviorSubject<MqttClientStatus>(MqttClientStatus.Idle);

    constructor (host: string, username?: string, password?: string) {
        this.host = host;
        this.username = username;
        this.password = password;
    }

    public connect = (): Observable<void> => {
        this.statuses.next(MqttClientStatus.Connecting);

        this.nativeMqttClient = mqtt.connect(this.host, {
            username: this.username,
            password: this.password,
            clientId: "mqtt_backend_presence",
        });

        this.nativeMqttClient.on("connect", ((): void => {
            logger.info("on connect");
            this.statuses.next(MqttClientStatus.Connected);
        }));

        this.nativeMqttClient.on("reconnect", ((): void => {
            this.statuses.next(MqttClientStatus.Connecting);
        }));

        this.nativeMqttClient.on("close", ((): void => {
            this.statuses.next(MqttClientStatus.Disconnected);
        }));

        this.nativeMqttClient.on("offline", ((): void => {
            this.statuses.next(MqttClientStatus.Disconnected);
        }));

        this.messages = Observable
            .create((observer: Subscriber<[Topic, Message]>) => {
                if (this.nativeMqttClient !== undefined) {
                    this.nativeMqttClient.on("message", function (topic: string, buffer: Buffer) {
                        observer.next([topic, buffer.toString()]);
                    });
                }
            })
            .publish()
            .refCount();

        return Observable.of((function () { })());
    }

    public getStatuses = (): Observable<MqttClientStatus> => {
        return this.statuses.asObservable();
    }

    public subscribe = (topic: string): Observable<string> => {
        return this.connectIfNeeded()
            .do(() => this.nativeMqttClient.subscribe(topic))
            .switchMap(() => this.messages)
            .filter(([t]) => t === topic)
            .map(([, message]) => message);
    }

    public publish = (topic: string, message: string): Observable<any> => {
        return this.connectIfNeeded()
            .do(() => this.nativeMqttClient.publish(topic, message))
            .switchMap(() => Observable.of({}));
    }

    private connectIfNeeded = (): Observable<MqttClientStatus> => {
        return this.getStatuses()
            .take(1)                                                        // Get latest connection status.
            .filter((status) => status === MqttClientStatus.Idle)           // Checks whether right now we have Idle realtime connection.
            .switchMap(() => this.connect())
            .defaultIfEmpty((function () {}()))                             // Triggers below stream is still being executed (in case the connection are not Idle).
            .switchMap((_) => this.getStatuses())
            .filter((status) => status === MqttClientStatus.Connected);     // Ensure we have Connected status.
    }
}
