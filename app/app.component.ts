import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Device, Script } from './models.ts';

@Component({
    selector: 'app',
    templateUrl: 'app/app.template.html',
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {
    devices: Array<Device> = new Array<Device>();
    scripts: Array<Script> = new Array<Script>();

    constructor(private http: Http){
        this.getDevices();
        this.getScripts();
    }

    getDevices(){
        this.http.get("/iot/devices").toPromise().then(res => {
            console.log(res.json());
            this.devices = res.json().devices;
        }).catch(err => {
        
        });

    }
    getScripts(){
        this.http.get("/api/scripts").toPromise().then(res => {
            console.log(res.json());
            this.scripts = res.json();
        }).catch(err => {
        
        });
    }


}
