import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ScriptVersion, Script } from './models.ts';
import { Subscription } from 'rxjs/Subscription';

import { DevicePickerComponent } from './devicepicker.component';
import { CodeEditorDirective } from './codeeditor.component';



@Component({
    selector: '[application]',
    templateUrl: "templates/script.template.html",
    directives: [ROUTER_DIRECTIVES, DevicePickerComponent, CodeEditorDirective]
})
export class ScriptComponent {
    scriptVersion: ScriptVersion = new ScriptVersion();
    script: Script = new Script();
    versions: Array<string> = new Array<string>();
    private sub: Subscription;
    id: string;

    editorConfig: Object;
    @ViewChild(CodeEditorDirective) codeEditor : CodeEditorDirective;
    @ViewChild('devicePicker') devicePicker; 

    constructor(private route: ActivatedRoute, private http: Http){ }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.getScript(this.id, null);
            this.getScriptVersions(this.id);
        });
        this.getDevices();
        this.devicePicker.selectionChanged = itemIds => {
            console.log("data" + itemIds);
            this.saveDevices(itemIds);
        };
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
        this.sub.unsubscribe();
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

        this.http.post("/iot/script/" + this.id + "/run", "").toPromise().then(res => {

        }).catch(err => {
            console.error(err);
        });

    }

}
