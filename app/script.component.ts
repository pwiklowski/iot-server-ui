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
    selector: 'app',
    templateUrl: "app/script.template.html",
    directives: [ROUTER_DIRECTIVES, Codemirror]
})
export class ScriptComponent {
    scriptVersion: ScriptVersion = new ScriptVersion();
    private sub: Subscription;
    id: string;

    editorConfig: Object;
    @ViewChild('code') codeEditor; 


    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.getScript(this.id, null);
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
            this.scriptVersion = res.json();
            this.codeEditor.writeValue(this.scriptVersion.Content);
        }).catch(err => {
        
        });
    }

    saveScript(){
        let content = '{"Content":"' + this.scriptVersion.Content + '"}';

        this.http.post("/api/script/" + this.id + "/version", content).toPromise().then(res => {
            this.scriptVersion = res.json();
        }).catch(err => {
        
        });
    }

}
