import { Injectable } from '@angular/core';



@Injectable()
export class IotService{
    static GET_DEVICES = "GET_DEVICES";
    static SET_VALUE = "GET_DEVICES";

    subscriptions = [];


    onConnectedCallbacks = [];


    socket;
    mid = 0;
    callbacks = {};

    constructor() {
        this.socket = new WebSocket("ws://192.168.1.4:9000/ws/");
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
    

    private onMessage(event){
        let data = JSON.parse(event.data);
        let msg = data.msg;
        let mid = data.mid; 

        let callback = this.callbacks[mid];

        if (callback !== undefined){
            callback(data.payload);

            delete this.callbacks[mid];
        }else{

            console.log("Unhandled message");
            console.log(data);
        }


    }

    getDevices(callback){
        this.send({"request": IotService.GET_DEVICES}, callback);
    }

    setValue(callback){
        this.send({"request": IotService.GET_DEVICES}, callback);
    }
        
    onConnected(callback){
        if (this.socket.readyState == 1)
            callback();
        else
            this.onConnectedCallbacks.push(callback);

    }

}
