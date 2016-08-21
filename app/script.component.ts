import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ScriptVersion } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import {Codemirror} from 'ng2-codemirror';
import 'codemirror/mode/javascript/javascript';
import { DevicePickerComponent } from './devicepicker.component';

@Component({
    selector: '[application]',
    templateUrl: "templates/script.template.html",
    directives: [ROUTER_DIRECTIVES, Codemirror, DevicePickerComponent]
})
export class ScriptComponent {
    scriptVersion: ScriptVersion = new ScriptVersion();
    versions: Array<string> = new Array<string>();
    private sub: Subscription;
    id: string;

    editorConfig: Object;
    @ViewChild('code') codeEditor; 
    @ViewChild('devicePicker') devicePicker; 

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.getScript(this.id, null);
            this.getScriptVersions(this.id);
        });
        this.getDevices();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    constructor(private route: ActivatedRoute, private http: Http){
        this.editorConfig = {
            lineNumbers: true,
            mode: {
                name: 'javascript',
                json: true
            }
        }
    }

    getScript(id:string, version){
        if (version == null){
            version = "latest";
        }

        this.http.get("/api/script/" + id + "/" + version).toPromise().then(res => {
            console.log(res.json());
            this.scriptVersion.Content = window.atob(res.json().Content);
            this.scriptVersion.Version = res.json().Version;
            this.codeEditor.writeValue(this.scriptVersion.Content);
        }).catch(err => {
        
        });
    }
    getDevices(){
        this.http.get("/iot/devices").toPromise().then(res => {
            let items = [];
            res.json().devices.forEach(device => {
                console.log(device);
                items.push( {
                    id  : device.id,
                    html: `<div style="font-size: 12px"><b>${device.name}</b></div><div style="font-size: 10px" >${device.id}</div>`,
                    content: device.id + device.name
                });
            });

            this.devicePicker.setItems(items);
        }).catch(err => {
            console.error(err);
        });
    }

    getScriptVersions(id: string){
        this.http.get("/api/scriptVersions/" + id).toPromise().then(res => {
            console.log(res.json());
            this.versions = res.json();
            
        }).catch(err => {
            console.error(err);
        });

    }

    saveScript(){
        let content = '{"Content":"' + window.btoa(this.codeEditor.value) + '"}';
        console.log(content);

        this.http.post("/api/script/" + this.id + "/version", content).toPromise().then(res => {
            this.scriptVersion.Content = window.atob(res.json().Content);
            this.scriptVersion.Version = res.json().Version;
            this.codeEditor.writeValue(this.scriptVersion.Content);

            this.getScriptVersions(this.id);

        }).catch(err => {
            console.error(err);
        });
    }

}
