import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import configData from "../../assets/projectConfig.json";
import { BaseServiceHelper } from './baseHelper.service';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {

    public hubConnection!: signalR.HubConnection;
    public messageReceived$ = new Subject<string>();
    public getTimeUpdate$ = new Subject<string>();
    private isConnectedSubject = new Subject<boolean>();
    isConnected$ = this.isConnectedSubject.asObservable();

    constructor(private _base: BaseServiceHelper) {
    }

    startConnection() {
        let accessToken = configData.project_id;
        const headers = { Authorization: `project_id ${accessToken}` };
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(configData.apiHubURL, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                headers: headers
            }).withAutomaticReconnect([10, 20, 40, 60, 80, 120, 160, 320])
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log('App Connected');
                this.isConnectedSubject.next(true);
                this.startListening()
            })
            .catch((err:any) => {
                console.error('App Connection Error: ', err);
                this.isConnectedSubject.next(false);
            });

        this.hubConnection.onclose(() => {
            console.log('App connection closed unexpectedly. Logging out...');
            this.logout(); // Call your logout logic here
        });
    }

    private startListening = () => {
        this.hubConnection.on('SendMessage', (message: string) => {
            this.messageReceived$.next(message);
        });

    }
    // Method to check if SignalR is connected
    isConnected(): boolean {
        return this.hubConnection?.state === signalR.HubConnectionState.Connected;
    }


    connectUser(userId: string) {
        if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection.invoke('ConnectUser', userId);
        }
    }

    public stopConnection() {
        this.hubConnection.stop();
    }

    public on(eventName: string, callback: (data: any) => void) {
        this.hubConnection.on(eventName, callback);
    }

    public send(methodName: string, data: any) {
        this.hubConnection.invoke(methodName, data);
    }

    logout() {
        this._base._appSessionService.clearUserSession();
        setTimeout(() => {
            this._base._commonService.navigation(['auth']);
        }, 500);
    }
}