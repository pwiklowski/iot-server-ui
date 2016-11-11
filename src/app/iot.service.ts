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
    static RequestRunScript= "RequestRunScript";

    static RequestSubscribeScript= "RequestSubscribeScript";
    static RequestUnsubscribeScript= "RequestUnsubscribeScript";

    static RequestSubscribeDevice= "RequestSubscribeDevice";
    static RequestUnsubscribeDevice= "RequestUnsubscribeDevice";

    static EventDeviceListUpdate = "EventDeviceListUpdate";
    static EventValueUpdate = "EventValueUpdate";

    subscriptions = new Map<number, Subscription>();
    subscriptionId = 0;


    onConnectedCallbacks = [];


    socket;
    mid = 0;
    callbacks = {};

    constructor() {
        this.connect();
    }

    connect(){
        this.socket = new WebSocket("ws://127.0.0.1:7002/");
        this.socket.onmessage = (e) => { this.onMessage(e);} ;

        this.socket.onopen = (e)=> {
            console.log('Connected!');
            this.onConnectedCallbacks.forEach((callback)=>{
                callback();
            });
            this.onConnectedCallbacks = [];
        };

        this.socket.onclose = (e) =>{
            console.log('Disconnected! reconnect!');
            setTimeout( ()=> this.connect(), 1000);
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
    
    private filterEvent(filter, event){
        if (filter !== undefined){
            for (var prop in filter) {
                console.log("check ", prop);
                if (!filter.hasOwnProperty(prop)) {
                    console.log("has own ", prop);
                    continue;
                }
                console.log(filter[prop], event[prop]);
                if ((event[prop] !==undefined) && filter[prop] !== event[prop]){
                    return false;
                }
            }
        }
        return true;
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
                        if (this.filterEvent(s.params,data.payload)){
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

    runScript(uuid, obj){
        this.send({
            "request": IotService.RequestRunScript,
            "uuid": uuid,
            "object" : obj
        
        });
    }

    setValue(di, variable, value){
        this.send({
            "request": IotService.RequestSetValue,
            "di" : di,
            "resource" : variable,
            "value" : value
        });
    }

    subscribeDevice(uuid, callback){
        this.send({
            "request": IotService.RequestSubscribeDevice,
            "uuid" : uuid
        });
    }

    unsubscribeDevice(uuid){
        this.send({
            "request": IotService.RequestUnsubscribeDevice,
            "uuid" : uuid
        });
    }

    subscribeScript(uuid, callback){
        this.send({
            "request": IotService.RequestSubscribeScript,
            "uuid" : uuid
        });
    }

    unsubscribeScript(uuid){
        this.send({
            "request": IotService.RequestUnsubscribeScript,
            "uuid" : uuid
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
