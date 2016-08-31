import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Device, Script } from './models.ts';
import { Router } from '@angular/router';

@Component({
    selector: '[application]',
    templateUrl: 'templates/app.template.html',
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {
    devices: Array<Device> = new Array<Device>();
    scripts: Array<Script> = new Array<Script>();

    constructor(private router: Router,private http: Http){
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
            this.scripts = res.json();
        }).catch(err => {
        
        });
    }

    createNewScript(){
        let content = '{"Name":"Nowa nazwa"}';

        this.http.post("/api/scripts", content).toPromise().then(res => {
            let uuid = res.json().ScriptUuid;
            this.router.navigate(['/script/'+uuid]);

            this.getScripts();

        }).catch(err => {
        
        });

    }

    isDeviceMenuOpen = false;
    isScriptMenuOpen = false;
    openDevices(){
        let menu = document.getElementById("iot-devices");
        if (this.isDeviceMenuOpen){
            menu.style.transform = "translate(0px)";
            this.isDeviceMenuOpen = false;
        } else {
            menu.style.transform = "translate(" + 370 + "px)";
            this.isDeviceMenuOpen = true;
        }
    }

    openScripts(){
        let menu = document.getElementById("iot-scripts");
        if (this.isScriptMenuOpen){
            menu.style.transform = "translate(0px)";
            this.isScriptMenuOpen = false;
        } else {
            menu.style.transform = "translate(" + 370 + "px)";
            this.isScriptMenuOpen = true;
        }
    }


}
