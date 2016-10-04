import { Injectable } from '@angular/core';



class Subscription{
    callback;
    params;
    event;

    constructor(event, params, callback){
        this.event = event;
        this.params = params;
        this.callback = callback;
    }
}


@Injectable()
export class IotService{

    static RequestGetDevices = "RequestGetDevices";
    static RequestGetDeviceResources = "RequestGetDeviceResources";
    static RequestSetValue = "RequestSetValue";

    static EventDeviceListUpdate = "EventDeviceListUpdate";
    static EventValueUpdate = "EventValueUpdate";

    subscriptions = new Map<number, Subscription>();
    subscriptionId = 0;


    onConnectedCallbacks = [];


    socket;
    mid = 0;
    callbacks = {};

    constructor() {
        this.socket = new WebSocket("ws://" + location.host + "/ws/");
        this.socket.onmessage = (e) => { this.onMessage(e);} ;

        this.socket.onopen = (e)=> {
            this.onConnectedCallbacks.forEach((callback)=>{
                callback();
            });

            this.onConnectedCallbacks = [];
        };
    }

    private send(request, callback=undefined){
        let message = {
            "payload": request
        };

        if (callback !== undefined){
            message["mid"] = this.mid;
            this.callbacks[this.mid] = callback;
            this.mid++;
        }

        this.socket.send(JSON.stringify(message));
    }
    

    private onMessage(e){
        let data = JSON.parse(e.data);
        let event = data.event;
        let mid = data.mid; 

        let callback = this.callbacks[mid];

        if (callback !== undefined){
            callback(data.payload);
            delete this.callbacks[mid];
        }else{
            for(let sub in this.subscriptions){
                let s = this.subscriptions[sub];

                if (s.event == event){
                    if (event == IotService.EventValueUpdate){
                        if(s.params.di == data.payload.di && s.params.resource == data.payload.resource){
                            s.callback(data.payload);
                        }
                    }else{
                        s.callback(data.payload);
                    }
                }
            }
        }


    }

    getDevices(callback){
        this.send({"request": IotService.RequestGetDevices}, callback);
    }

    getDeviceResources(uuid, callback){
        this.send({
            "request": IotService.RequestGetDeviceResources,
            "uuid" : uuid
        }, callback);
    }
    }

    setValue(di, variable, value){
        this.send({
            "request": IotService.RequestSetValue,
            "di" : di,
            "resource" : variable,
            "value" : value
        });
    }

    subscribe(event, params, callback): number {
        let s = new Subscription(event, params, callback);

        this.subscriptionId++;
        this.subscriptions[this.subscriptionId] = s;
        return this.subscriptionId;
    }
        
    onConnected(callback){
        if (this.socket.readyState == 1)
            callback();
        else
            this.onConnectedCallbacks.push(callback);
    }

}
