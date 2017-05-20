import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

import { VariableGenericComponent } from './variable-generic.component';
import { VariableLightDimmingComponent } from './variable-dimming.component';
import { VariableColourRgbComponent } from './variable-rgb.component';
import { VariableBinnaryComponent } from './variable-binnary.component';

import { IotService } from './iot.service';
import { MapToIterable } from './pipes';


@Component({
    selector: '[window]',
    templateUrl: "devices.template.html",
    styles:[`
    .iot-device{
      width: 100%;
    }
    .iot-device-resources{
      max-height: 250px;
      overflow-y: auto;
      padding: 20px;
    }
    `]
})
export class DevicesComponent {
    uuid: string;
    device: Device = new Device();
    onClose = undefined;
    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    variablesComponents = {};


    sub;


    constructor(private componentFactoryResolver: ComponentFactoryResolver, private http: Http, private iot: IotService){

    }

    ngOnInit() {
        this.iot.onConnected(()=>{
            this.iot.subscribeDevice(this.uuid, null);
            this.device.variables.forEach(v => {
                let factory = this.componentFactoryResolver.resolveComponentFactory(this.variableComponentFactory(v.rt));

                let c = this.container.createComponent(factory);  
                (<any>c.instance).init(this.uuid, v);

                this.variablesComponents[v.name] = c;
            });
        });
    }
    ngOnDestroy(){
        this.iot.unsubscribeDevice(this.uuid);
    }

    variableComponentFactory(rt) : any{
        if (rt == "oic.r.light.dimming"){
            return VariableLightDimmingComponent;
        }else if(rt === "oic.r.colour.rgb"){
            return VariableColourRgbComponent;
        }else if(rt === "oic.r.switch.binary"){
            return VariableBinnaryComponent;
        }else{
            return VariableGenericComponent;
        }
    }

    close(){
        if (this.onClose) this.onClose();
        console.log("close");
    }

}
