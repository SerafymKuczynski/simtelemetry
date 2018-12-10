import Vue from "vue";

import PC2SimClient from "../Games/PC2/PC2SimClient";
import SimClient from "./SimClient";
import { ISimClientState } from "./type";

interface ISubscriber {
    instance: any;
    listener: (df: ISimClientState) => void;
}

export default class SimClientManager {

    public get clients() {
        return [
            { name: "Project Cars 2", clazz: PC2SimClient }
        ];
    }

    public activeClient?: SimClient;
    private activeTimer?: NodeJS.Timeout;

    private subscribers: ISubscriber[] = [];

    public startClient(name: string): void {

        if (this.activeClient) {
            throw new Error("Can't start new client, while an old one is active");
        }

        const clientDescriptor = this.clients.find((x) => x.name === name);
        if (!clientDescriptor) {
            throw new Error("Failed to find client " + name);
        }

        Vue.set(this, "activeClient", new (clientDescriptor.clazz)());
        this.activeClient!.start();
        this.activeTimer = setInterval(() => {
            if (this.activeClient) {
                if (this.activeClient.gameIsActive) {
                    this.emitDataframe(this.activeClient.state);
                }
            } else {
                console.log("Timer active but no client");
                clearInterval(this.activeTimer!);
            }
        }, 1000 / 30);

    }

    public stopClient(): void {

        if (!this.activeClient) {
            throw new Error("Failed to stop client: No client active");
        }

        if (this.activeTimer) {
            clearInterval(this.activeTimer);
        }

        this.activeClient.stop();
        Vue.set(this, "activeClient", undefined);

    }

    public subscribe(instance: any, listener: (df: ISimClientState) => void) {
        if (!this.subscribers.some((x) => x.instance === instance)) {
            this.subscribers.push({ instance, listener });
        }
    }

    public unsubscribe(instance: any) {
        this.subscribers = this.subscribers.filter((x) => x.instance !== instance);
    }

    private emitDataframe(df: ISimClientState) {
        this.subscribers.forEach((x) => x.listener(df));
    }

}
