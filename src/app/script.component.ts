import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ScriptVersion, Script, Log } from './models.ts';
import { Subscription } from 'rxjs/Subscription';

import { DevicePickerComponent } from './devicepicker.component';
import { EventEditorDirective } from './eventeditor.directive';
import { CodeEditorDirective } from './codeeditor.component';
import {Observable} from 'rxjs/Rx';
import { IotService } from './iot.service';


@Component({
    selector: '[script]',
    templateUrl: "script.template.html",
    styles:[`
    .iot-script{
      width: 100%;
      height: 100%;
    },
    .iot-script-name { font-size: 24px;   font-family: 'Roboto', sans-serif;  }
    `]
})
export class ScriptComponent {
    onClose = undefined;
    scriptVersion: ScriptVersion = new ScriptVersion();
    script: Script = new Script();
    devices = [];
    versions: Array<string> = new Array<string>();
    private sub: Subscription;
    id: string;
    logs: Array<Log> = new Array<Log>();

    editorConfig: Object;
    @ViewChild(CodeEditorDirective) codeEditor : CodeEditorDirective;
    @ViewChild(EventEditorDirective) eventEditor: EventEditorDirective;
    @ViewChild('devicePicker') devicePicker; 

    constructor(private http: Http, private iot: IotService){ }

    ngOnInit() {
        this.iot.onConnected(()=>{
            this.iot.subscribeScript(this.id);
            this.iot.getDevices((payload)=>{
                console.log(payload);
                this.devices = payload.devices;
                let items = [];
                this.devices.forEach(device => {
                    items.push( {
                        id  : device.id,
                        text: device.id,
                        listHtml: `<div style="font-size: 14px"><b>${device.name}</b></div><div style="font-size: 12px" >${device.id}</div>`,
                        inputHtml: `<div style="font-size: 16px"><b>${device.id}</b></div>`,
                        content: device.id + device.name
                    });
                });

                this.codeEditor.setDevices(this.devices);
                this.devicePicker.setItems(items);
            });
        });
        this.devicePicker.selectionChanged = itemIds => {
            console.log("data" + itemIds);
            this.saveDevices(itemIds);
        };
        this.getScript(this.id, null);
        this.getScriptVersions(this.id);


    }
    ngAfterViewInit(){
        this.eventEditor.setValue(` { "source": "id", "resource": "res", "value" : {"val":4} } `);
    }

    saveDevices(devices){
        let content = {"DeviceUuid": devices};

        this.http.post("/api/script/" + this.script.ScriptUuid, content).toPromise().then(res => {

        }).catch(err => {
            console.error(err);
        });
    }

    saveName(){
        console.log("save name " + this.script.Name);
        let content = '{"Name":"'+ this.script.Name+'" }';

        this.http.post("/api/script/" + this.script.ScriptUuid, content).toPromise().then(res => {

        }).catch(err => {
            console.error(err);
        });
    }
    

    ngOnDestroy() {
        this.iot.unsubscribeScript(this.id);
    }


    getScript(id:string, version){

        this.http.get("/api/script/" + id).toPromise().then(res => {
            console.log(res.json());
            this.script = res.json();
            this.scriptVersion.Content = window.atob(res.json().Scripts[0].Content);
            this.scriptVersion.Version = res.json().Scripts[0].Version;
            this.codeEditor.setContent(this.scriptVersion.Content);
            this.devicePicker.setSelectedItems(res.json().DeviceUuid);
        }).catch(err => {
            console.error(err);
        
        });
    }

    getScriptVersions(id: string){
        this.http.get("/api/scriptVersions/" + id).toPromise().then(res => {
            this.versions = res.json();
            
        }).catch(err => {
            console.error(err);
        });

    }

    saveScript(){
        let content = '{"Content":"' + window.btoa(this.codeEditor.getValue()) + '"}';

        this.http.post("/api/script/" + this.id + "/version", content).toPromise().then(res => {
            this.scriptVersion.Content = window.atob(res.json().Content);
            this.scriptVersion.Version = res.json().Version;
            this.codeEditor.setContent(this.scriptVersion.Content);

            this.getScriptVersions(this.id);

        }).catch(err => {
            console.error(err);
        });
    }

    runScript(){
        let content = JSON.parse(this.eventEditor.getValue());
        this.iot.runScript(this.id, content);
    }

    close(){
        if (this.onClose) this.onClose();
    }

}
