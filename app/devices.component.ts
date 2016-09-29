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

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private http: Http){
    }

    ngOnInit() {
        this.getValues(this.id);
    }


    getValues(uuid: string){
        this.http.get("/iot/values/"+uuid).toPromise().then(res => {
            this.variables = res.json();

            this.variables.forEach(v => {
                let factory = this.componentFactoryResolver.resolveComponentFactory(
                    this.variableComponentFactory(v.values["rt"]));

                let c = this.container.createComponent(factory);  
                (<any>c.instance).init(this.id, v.name, v.values);

                this.variablesComponents[v.name] = c;
            });
            
        }).catch(err => {
            console.error(err);
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
