import { Component, ViewContainerRef, ViewChild, Inject, forwardRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ScriptVersion, Script, Log } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { AppComponent } from './app.component';
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
    }
    .iot-script-content{
        padding: 10px;
    }
    `]
})
export class ScriptComponent {
    onClose = undefined;
    scriptVersion: ScriptVersion = new ScriptVersion();
    script: Script = new Script();
    devices = [];
    selectedDevices = [];
    versions: Array<string> = new Array<string>();
    private sub: Subscription;
    id: string;
    logs: Array<Log> = new Array<Log>();

    editorConfig: Object;
    @ViewChild(CodeEditorDirective) codeEditor : CodeEditorDirective;
    @ViewChild(EventEditorDirective) eventEditor: EventEditorDirective;
    @ViewChild('devicePicker') devicePicker; 

    constructor(private http: Http, private iot: IotService, @Inject(forwardRef(() => AppComponent)) private app: AppComponent){ }

    ngOnInit() {
        this.iot.onConnected(()=>{
            this.iot.subscribeScript(this.id);
            this.iot.getDevices((payload)=>{
                this.devices = payload.devices;
                let items = [];
                this.devices.forEach(device => {
                    items.push( {
                        id  : device.id,
                        text: device.id,
                        listHtml: `<div style="padding: 5px" ><div style="font-size: 18px">${this.iot.getAlias(device.id)}</div><div style="font-size: 12px" >${device.id}</div></div>`,
                        inputHtml: `<div style="font-size: 16px"><b>${device.id}</b></div>`,
                        content: device.id + device.name
                    });
                });

                this.codeEditor.setDevices(this.devices);
                this.devicePicker.setItems(items);
            });
        });
        this.devicePicker.selectionChanged = itemIds => {
            this.selectedDevices = [];
            itemIds.forEach((item)=>{
                this.selectedDevices.push(item.id);
            });

            this.saveDevices(this.selectedDevices);
        };
        this.getScript(this.id, null);
        this.getScriptVersions(this.id);


    }
    ngAfterViewInit(){
        this.eventEditor.setValue(` { "source": "id", "resource": "res", "value" : {"val":4} } `);
    }

    saveDevices(devices){
        let content = {"DeviceUuid": devices};

        this.iot.post("/api/script/" + this.script.ScriptUuid, content).then(res => {

        }).catch(err => {
            console.error(err);
        });
        this.app.getScripts();
    }

    saveName(){
        console.log("save name " + this.script.Name);
        let content = '{"Name":"'+ this.script.Name+'" }';

        this.iot.post("/api/script/" + this.script.ScriptUuid, content).then(res => {
            this.app.getScripts();
        }).catch(err => {
            console.error(err);
        });
    }
    

    ngOnDestroy() {
        this.iot.unsubscribeScript(this.id);
    }


    getScript(id:string, version){

        this.iot.get("/api/script/" + id).then(res => {
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
        this.iot.get("/api/scriptVersions/" + id).then(res => {
            this.versions = res.json();
            
        }).catch(err => {
            console.error(err);
        });

    }

    saveScript(){
        let content = '{"Content":"' + window.btoa(this.codeEditor.getValue()) + '"}';

        this.iot.post("/api/script/" + this.id + "/version", content).then(res => {
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
