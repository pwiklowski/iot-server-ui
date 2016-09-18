import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, DynamicComponentLoader,ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { VariableGenericComponent } from './variable-generic.component';
import { VariableLightDimmingComponent } from './variable-dimming.component';
import { VariableColourRgbComponent } from './variable-rgb.component';


import { MapToIterable } from './pipes';


@Component({
    selector: '[window]',
    templateUrl: "templates/devices.template.html",
    pipes: [MapToIterable],
    directives: []
})
export class DevicesComponent {
    id: string;
    device: Device = new Device();
    variables: Array<DeviceVariable> = new Array<DeviceVariable>();
    onClose = undefined;
    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    socket; 

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private http: Http){
    }

    ngOnInit() {
        this.getValues(this.id);
        this.socket = new WebSocket("ws://192.168.1.4:16000/device/" + this.id + "/value");
        this.socket.onmessage = this.onMessage;
    }


    getValues(uuid: string){
        this.http.get("/iot/values/"+uuid).toPromise().then(res => {
            this.variables = res.json();

            this.variables.forEach(v => {
                let factory = this.componentFactoryResolver.resolveComponentFactory(this.variableComponentFactory(v.values["rt"]));
                let c = this.container.createComponent(factory);  
                (<any>c.instance).setValue(v);
                (<any>c.instance).onValueChanged = (r,v) => {
                    this.onValueChanged(r, v);
                };
            });
            
        }).catch(err => {
            console.error(err);
        });

    }

    onValueChanged(resource, value){
        console.log("onValueChanged " + resource);
        let message = {
            "resource": resource,
            "value": value

        };
        this.socket.send(JSON.stringify(message));
    }

    onMessage(event){
        console.log("onMessage");
        console.log(event);

    }



    variableComponentFactory(rt){
        if (rt == "oic.r.light.dimming"){
            return VariableLightDimmingComponent;
        }else if(rt === "oic.r.colour.rgb"){
            return VariableColourRgbComponent;
        }else{
            return VariableGenericComponent;
        }
    }

    close(){
        if (this.onClose) this.onClose();
    }

}
