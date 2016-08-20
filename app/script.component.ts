import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ScriptVersion } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import {Codemirror} from 'ng2-codemirror';
import 'codemirror/mode/javascript/javascript';


@Component({
    selector: '[application]',
    templateUrl: "templates/script.template.html",
    directives: [ROUTER_DIRECTIVES, Codemirror]
})
export class ScriptComponent {
    scriptVersion: ScriptVersion = new ScriptVersion();
    versions: Array<string> = new Array<string>();
    private sub: Subscription;
    id: string;

    editorConfig: Object;
    @ViewChild('code') codeEditor; 

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.getScript(this.id, null);
            this.getScriptVersions(this.id);
        });
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

    getScriptVersions(id: string){
        this.http.get("/api/scriptVersions/" + id).toPromise().then(res => {
            console.log(res.json());
            this.versions = res.json();
            
        }).catch(err => {
        
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
        
        });
    }

}
