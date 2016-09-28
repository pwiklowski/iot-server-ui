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
    variablesComponents = {};
    socket; 

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private http: Http){
    }

    ngOnInit() {
        this.getValues(this.id);
        this.socket = new WebSocket("ws://192.168.1.4:9000/ws/");
        this.socket.onmessage = (e) => { this.onMessage(e);} ;
    }


    getValues(uuid: string){
        this.http.get("/iot/values/"+uuid).toPromise().then(res => {
            this.variables = res.json();

            this.variables.forEach(v => {
                let factory = this.componentFactoryResolver.resolveComponentFactory(
                    this.variableComponentFactory(v.values["rt"]));

                let c = this.container.createComponent(factory);  
                (<any>c.instance).setValue(v.name, v.values);
                (<any>c.instance).onValueChanged = (r,v) => {
                    this.onValueChanged(r, v);
                };

                this.variablesComponents[v.name] = c;
                console.log(this.variablesComponents);

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
        let data = JSON.parse(event.data);
        let resource = data.resource;
        let value = data.value;

        Object.keys(this.variablesComponents).forEach( key => {
            if (key === resource){
                let c = this.variablesComponents[key];
                (<any>c.instance).setValue(resource, value);
            }
        });
    }



    variableComponentFactory(rt) : any{
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
