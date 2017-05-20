import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "./auth.service";

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

    static IOT_CLOUD_URL = "ws://127.0.0.1:12345/connect";

    static RequestAuthorize = "RequestAuthorize";
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

    static RequestReloadSchedule = "RequestReloadSchedule";

    static EventLog = "EventLog";

    subscriptions = new Map<number, Subscription>();
    subscriptionId = 0;


    onConnectedCallbacks = [];


    socket;
    mid = 0;
    callbacks = {};

    deviceAliases = new Map<string, string>();
    devices = [];

    user = {};
    isLogged = false;

    constructor(private http: Http, private auth: AuthService){
        this.connect();
    }

    connect(){
        if (this.auth.getToken() == undefined) return;
        this.socket = new WebSocket(IotService.IOT_CLOUD_URL);
        this.socket.onmessage = (e) => { this.onMessage(e);} ;

        this.socket.onopen = (e)=> {
            console.log('Connected!');


            let req = {
                "token" : this.auth.getToken()
            };
            
            this.send(IotService.RequestAuthorize, req, (res)=>{
                if (res){
                    this.onConnectedCallbacks.forEach((callback)=>{
                        callback();
                    });
                    this.onConnectedCallbacks = [];
                }
            });
        };

        this.socket.onclose = (e) =>{
            console.log('Disconnected! reconnect!');
            setTimeout( ()=> this.connect(), 1000);
        };

    }

    private send(name, payload, callback=undefined){
        let message = {
            "name" : name,
            "payload": payload
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
                if (!filter.hasOwnProperty(prop)) {
                    continue;
                }
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

        if (event== IotService.EventDeviceListUpdate){
            this.devices = data.payload.devices;
            console.log(this.devices);
        }

        if (callback !== undefined){
            callback(data.payload);
            delete this.callbacks[mid];
        }else{
            for(let sub in this.subscriptions){
                let s = this.subscriptions[sub];
                if (s.event == event){
                    if (this.filterEvent(s.params,data.payload)){
                        s.callback(data.payload);
                    }
                }
            }
        }


    }

    getDevices(callback){
        this.send(IotService.RequestGetDevices, null, callback);
    }

    getDeviceResources(uuid, callback){
        this.send(IotService.RequestGetDeviceResources,{"uuid" : uuid}, callback);
    }

    setValue(di, variable, value){
        this.send(IotService.RequestSetValue, {"di" : di, "resource" : variable, "value" : value });
    }

    subscribeDevice(uuid, callback){
        this.send(IotService.RequestSubscribeDevice,{"uuid" : uuid});
    }

    unsubscribeDevice(uuid){
        this.send(IotService.RequestUnsubscribeDevice,{"uuid" : uuid});
    }

    subscribe(event, params, callback): number {
        let s = new Subscription(event, params, callback);

        this.subscriptionId++;
        this.subscriptions[this.subscriptionId] = s;
        return this.subscriptionId;
    }
        
    onConnected(callback){
        if (this.socket != undefined && this.socket.readyState == 1)
            callback();
        else
            this.onConnectedCallbacks.push(callback);
    }

}
