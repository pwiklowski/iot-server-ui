import { Component,ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, Script } from './models.ts';
import { BrowserModule} from '@angular/platform-browser';
import { WMComponent } from './wm.component';
import { DevicesComponent} from './devices.component';

import { HTTP_PROVIDERS } from '@angular/http';
import {provide} from '@angular/core';

@Component({
    selector: '[application]',
    templateUrl: 'templates/app.template.html',
    directives: [WMComponent]
})
export class AppComponent {
    devices: Array<Device> = new Array<Device>();
    scripts: Array<Script> = new Array<Script>();

    @ViewChild('windowManager') windowManager: WMComponent;

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
        let d = this.windowManager.attach(DevicesComponent);
        d.instance.id = device.id;
    }


}


@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  entryComponents: [ DevicesComponent ],
  bootstrap: [ AppComponent ],
  providers: [ HTTP_PROVIDERS, WMComponent]
})
export class AppModule {}
