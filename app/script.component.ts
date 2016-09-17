import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ScriptVersion, Script, Log } from './models.ts';
import { Subscription } from 'rxjs/Subscription';

import { DevicePickerComponent } from './devicepicker.component';
import { EventEditorDirective } from './eventeditor.directive';
import { CodeEditorDirective } from './codeeditor.component';
import {Observable} from 'rxjs/Rx';



@Component({
    selector: '[script]',
    templateUrl: "templates/script.template.html",
    directives: [DevicePickerComponent, CodeEditorDirective, EventEditorDirective]
})
export class ScriptComponent {
    onClose = undefined;
    scriptVersion: ScriptVersion = new ScriptVersion();
    script: Script = new Script();
    versions: Array<string> = new Array<string>();
    private sub: Subscription;
    id: string;
    logs: Array<Log> = new Array<Log>();

    editorConfig: Object;
    @ViewChild(CodeEditorDirective) codeEditor : CodeEditorDirective;
    @ViewChild(EventEditorDirective) eventEditor: EventEditorDirective;
    @ViewChild('devicePicker') devicePicker; 

    timer;
    timerSubscription;

    constructor(private http: Http){ }

    ngOnInit() {
        this.getScript(this.id, null);
        this.getScriptVersions(this.id);
        this.logs = new Array<Log>();
        this.getLogs();
        this.getDevices();
        this.devicePicker.selectionChanged = itemIds => {
            console.log("data" + itemIds);
            this.saveDevices(itemIds);
        };

        this.timer = Observable.timer(1000,1000);
        this.timerSubscription = this.timer.subscribe(()=>{ this.getLogs()});
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
        this.timerSubscription.unsubscribe();
    }


    getScript(id:string, version){

        this.http.get("/api/script/" + id).toPromise().then(res => {
            console.log(res.json());
            this.script = res.json();
            this.scriptVersion.Content = window.atob(res.json().Scripts[0].Content);
            this.scriptVersion.Version = res.json().Scripts[0].Version;
            
            this.devicePicker.setSelectedItems(res.json().DeviceUuid);
            this.codeEditor.setContent(this.scriptVersion.Content);
        }).catch(err => {
            console.error(err);
        
        });
    }
    getDevices(){
        this.http.get("/iot/devices").toPromise().then(res => {
            let items = [];
            res.json().devices.forEach(device => {
                items.push( {
                    id  : device.id,
                    text: device.id,
                    listHtml: `<div style="font-size: 14px"><b>${device.name}</b></div><div style="font-size: 12px" >${device.id}</div>`,
                    inputHtml: `<div style="font-size: 16px"><b>${device.id}</b></div>`,
                    content: device.id + device.name
                });
            });

            this.codeEditor.setDevices(res.json().devices);
            this.devicePicker.setItems(items);
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
        let content = this.eventEditor.getValue();

        this.http.post("/iot/script/" + this.id + "/run", content).toPromise().then(res => {

        }).catch(err => {
            console.error(err);
        });

    }
    
    getLastLogTimeStamp() : number{
        if(this.logs.length > 0)
            return this.logs[this.logs.length-1].Timestamp;
        else
            return 0;
    }


    getLogs(){
        this.http.get("/api/logs/" +this.id+ "/" + this.getLastLogTimeStamp()).toPromise().then(res => {
            let logs : Array<Log>  =  res.json();
            logs.forEach(log=>{
                this.logs.push(log);
                
            });

            var myDiv = document.getElementById('iot-logs');
            myDiv.scrollTop = 0;

        }).catch(err => {
            console.error(err);
        });
    }


    close(){
        if (this.onClose) this.onClose();
    }

}
