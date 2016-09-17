import { Component,ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, Script } from './models.ts';
import { BrowserModule} from '@angular/platform-browser';
import { WMComponent } from './wm.component';
import { WMDevicesComponent } from './wm-devices.component';
import { DevicesComponent} from './devices.component';
import { ScriptComponent} from './script.component';
import { WindowComponent } from './window.component';

import { HTTP_PROVIDERS } from '@angular/http';
import {provide} from '@angular/core';

@Component({
    selector: '[application]',
    templateUrl: 'templates/app.template.html',
    directives: [WMComponent, WMDevicesComponent]
})
export class AppComponent {
    devices: Array<Device> = new Array<Device>();
    scripts: Array<Script> = new Array<Script>();
    showScript : boolean;
    showDevices: boolean;


    @ViewChild('deviceManager') deviceManager: WMDevicesComponent;
    @ViewChild('scriptManager') scriptManager: WMComponent;

    constructor(private http: Http){
        this.getDevices();
        this.getScripts();
    }




    ngAfterViewInit(){
        window.addEventListener("resize", this.redraw, true);
    }

    getDevices(){
        this.http.get("/iot/devices").toPromise().then(res => {
            this.devices = res.json().devices;
        }).catch(err => {
            console.log(err);
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
            this.getScripts();

        }).catch(err => {
        
        });

    }

    isDeviceMenuOpen = false;
    isScriptMenuOpen = false;

    slideDevices(open: boolean){
        let menu = document.getElementById("iot-devices");
        if (!open){
            menu.style.transform = "translate(0px)";
            this.isDeviceMenuOpen = false;
        } else {
            menu.style.transform = "translate(" + 370 + "px)";
            this.isDeviceMenuOpen = true;
        }
    }

    

    slideScripts(open: boolean){
        let menu = document.getElementById("iot-scripts");
        if (!open){
            menu.style.transform = "translate(0px)";
            this.isScriptMenuOpen = false;
        } else {
            menu.style.transform = "translate(" + 370 + "px)";
            this.isScriptMenuOpen = true;
        }
    }


    attachDevice(device){
        this.deviceManager.attach(DevicesComponent, (d)=>{
            d.instance.id = device.id;
            d.instance.device = device;
        this.redraw();
        });
    }
    attachScript(script){
        this.scriptManager.attach(ScriptComponent, (d)=>{
            d.instance.id = script.ScriptUuid;
            this.redraw();
        });
    }


    redraw(){
        let panel = document.getElementById("iot-content");
        let devices = document.getElementById("iot-device-manager");
        let scripts = document.getElementById("iot-script-manager");

        let width = panel.offsetWidth;

        let devicesWidth = 400;

        let scriptsWidth = width - devicesWidth;;

        scripts.style.width = scriptsWidth + "px";
        devices.style.width = devicesWidth + "px";
    }

}


@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  entryComponents: [ DevicesComponent, ScriptComponent, WindowComponent],
  bootstrap: [ AppComponent ],
  providers: [ HTTP_PROVIDERS, WMComponent]
})
export class AppModule {}
