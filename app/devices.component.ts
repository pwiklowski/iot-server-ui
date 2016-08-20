import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ActivatedRoute } from '@angular/router';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Device, DeviceValue, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { Pipe } from '@angular/core';




@Pipe({
    name: 'mapToIterable'
})
export class MapToIterable {
    transform(map: {}, args: any[] = null): any {
        if (!map)
            return null;
    
        var x = Object.keys(map).map((key) => ({ 'key': key, 'value': map[key] }));
        console.log(x);
        return x;
    }
}


@Component({
    selector: 'app',
    templateUrl: "app/devices.template.html",
    pipes: [MapToIterable],
    directives: [ROUTER_DIRECTIVES]
})
export class DevicesComponent {
    private sub: Subscription;
    id: string;
    variables: Array<DeviceVariable> = new Array<DeviceVariable>();

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.getValues(this.id);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    constructor(private route: ActivatedRoute, private http: Http){ }

    getValues(uuid: string){
        this.http.get("/iot/values/"+uuid).toPromise().then(res => {
            console.log(res.json());
            this.variables = res.json();
            console.log(this.variables[0].name);
        }).catch(err => {
        
        });

    }

}
