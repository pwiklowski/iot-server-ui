import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ScriptVersion } from './models.ts';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app',
    templateUrl: "app/script.template.html",
    directives: [ROUTER_DIRECTIVES]
})
export class ScriptComponent {
    scriptVersion: ScriptVersion = new ScriptVersion;
    private sub: Subscription;
    id: string;

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
    }

    getScript(id:string, version){
        if (version == null){
            version = "latest";
        }

        this.http.get("/api/script/" + id + "/" + version).toPromise().then(res => {
            console.log(res.json());
            this.scriptVersion = res.json();
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
