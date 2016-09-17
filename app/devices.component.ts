import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceValue, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, DynamicComponentLoader,ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { VariableGenericComponent } from './variable-generic.component';

import { MapToIterable } from './pipes';


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

    onClose = undefined;

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;


    constructor(private componentFactoryResolver: ComponentFactoryResolver, private http: Http){ }

    ngOnInit() {
        this.getValues(this.id);
    }


    getValues(uuid: string){



        this.http.get("/iot/values/"+uuid).toPromise().then(res => {
            this.variables = res.json();

            this.variables.forEach(v => {
                let factory = this.componentFactoryResolver.resolveComponentFactory(this.variableComponentFactory("dsf"));
                let c = this.container.createComponent(factory);  
                (<any>c.instance).variable = v;
            });

            
        }).catch(err => {
            console.error(err);
        
        });

    }

    variableComponentFactory(rt){
        console.log("create component for variable " + rt);
        return VariableGenericComponent;
    }

    close(){
        if (this.onClose) this.onClose();
    }

}
