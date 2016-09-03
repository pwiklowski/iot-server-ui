import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
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
        return Object.keys(map).map((key) => ({ 'key': key, 'value': map[key] }));
    }
}


@Component({
    selector: '[window]',
    templateUrl: "templates/devices.template.html",
    pipes: [MapToIterable],
    directives: []
})
export class DevicesComponent {
    private sub: Subscription;
    id: string;
    device: Device = new Device();
    variables: Array<DeviceVariable> = new Array<DeviceVariable>();

    constructor(private http: Http){ }

    ngOnInit() {
        this.getValues(this.id);
    }


    getValues(uuid: string){
        this.http.get("/iot/values/"+uuid).toPromise().then(res => {
            console.log(res.json());
            this.variables = res.json();
            console.log(this.variables[0].name);
        }).catch(err => {
        
        });

    }

}
