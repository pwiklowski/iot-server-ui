import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';



export class Device{
    id: string;
    name: string;

}

@Component({
    selector: 'app',
    templateUrl: "app/devices.template.html",
    directives: [ROUTER_DIRECTIVES]
})
export class DevicesComponent {
    devices: Array<Device> = new Array<Device>();

    constructor(private http: Http){
        this.getDevices();
    }

    getDevices(){
        this.http.get("/api/devices").toPromise().then(res => {
            console.log(res.json());
            this.devices = res.json().devices;
        }).catch(err => {
        
        });

    }

}
