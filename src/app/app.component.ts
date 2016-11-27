import { Component,ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, Script } from './models.ts';
import { Injectable } from '@angular/core';
import { MdlDialogService,MdlSnackbarService } from 'angular2-mdl';

import {Observable} from 'rxjs/Observable';
import { WMScriptsComponent } from './wm-scripts.component';
import { WMDevicesComponent } from './wm-devices.component';
import { DevicesComponent} from './devices.component';
import { ScriptComponent} from './script.component';
import { DevicePickerComponent } from './devicepicker.component';




import { IotService } from './iot.service';

@Injectable()
@Component({
    selector: 'application',
    templateUrl: 'app.template.html',
    styles:[`
    #iot-device-manager{
        padding:20px;
    }
    #iot-script-manager{
        padding:20px;
    }
    .iot-add-script-button {
        z-index:5;
        position: absolute;
        bottom: 20px;
        right: 20px;
        transform: translateX(300px);
        transition: all 200ms ease-out;
    }
    .visible {
        transform: translateX(0px);
    }
    .iot-button-label{
        float: left;
        height: 36px;
        line-height: 36px;
        background-color: rgba(0,0,0, 0.5);
        margin: 10px;
        padding: 0 10px;
        color: white;
        border-radius: 4px;
    }

   .iot-delete-icon{
       float: right;
   } 


    `]
})
export class AppComponent {
    devices: Array<Device> = new Array<Device>();
    scripts: Array<Script> = new Array<Script>();
    showScript : boolean = false;
    showDevice: boolean = false;
    panelView;
    devicesView;
    
    scriptsView;


    @ViewChild('deviceManager') deviceManager: WMDevicesComponent;
    @ViewChild('scriptManager') scriptManager: WMScriptsComponent;
    @ViewChild('layout')layout;

    sub;

    constructor(private http: Http, private iot: IotService,
                private dialogService: MdlDialogService, private snack: MdlSnackbarService){
        this.getScripts();

        iot.onConnected(()=>{
            this.iot.getDevices((payload)=>{
                this.devices = payload.devices;
            });
            this.sub = this.iot.subscribe("EventDeviceListUpdate", {}, (payload)=>{
                this.devices = payload.devices;
            });
        });
    }

    ngAfterViewInit(){
        this.panelView = document.getElementById("iot-content");
        this.devicesView = document.getElementById("iot-device-manager");
        this.scriptsView = document.getElementById("iot-script-manager");
        
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
            this.attachScript(res.json());
            this.layout.closeDrawer();


        }).catch(err => {
        
        });

    }
    deleteScript(event, script){
        event.stopPropagation();
        let r = this.dialogService.confirm('Are you sure ?', 'No', 'Yes');
        r.subscribe(
            ()=>{
                this.layout.closeDrawer();
                this.http.delete("/api/script/" + script.ScriptUuid).toPromise().then(res => {
                    this.snack.showSnackbar({
                        message:'Script was deleted'
                    });
                    this.getScripts();
                }).catch(err => {
                    console.error(err);
                });
            },
            (err: any) => {

            }
        );
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
        this.showDevice = true;
        this.redraw();

        this.deviceManager.attach(DevicesComponent, (d)=>{
            d.instance.id = device.id;
            d.instance.device = device;
            this.redraw();
        }, ()=>{
            this.showDevice = false;
            this.redraw();
        });
    }

    attachScript(script){
        this.showScript = true;
        this.redraw();
        this.scriptManager.attach(ScriptComponent, (d)=>{
            d.instance.id = script.ScriptUuid;
            this.redraw();
        }, ()=>{
            this.showScript = false;
            this.redraw();
        
        });
    }


    redraw(){
        let width = this.panelView.offsetWidth;
        let devicesWidth = this.showDevice ? (this.showScript ? 500 : 700 ) : 0;
        let scriptsWidth = this.showScript ? (width - devicesWidth) : 0;

        if (scriptsWidth == 0){
            this.devicesView.style.left = (width/2 - devicesWidth/2) + "px";
        }else{
            this.devicesView.style.left = "0px";
        }


        this.scriptsView.style.width = scriptsWidth + "px";
        this.devicesView.style.width = devicesWidth + "px";
    }

}
