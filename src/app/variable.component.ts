import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { MapToIterable } from './pipes';
import {IotService} from './iot.service';

@Component({
    selector: '[variable]',
    template: `
    <div>
        {{name}}
        <div *ngFor="let v of values | mapToIterable">
            {{v.key}}: {{ v.value}}
        </div>
    </div>`,
})
export class VariableComponent {
    name: string;
    uuid: string;
    hubUuid: string;
    variable;
    sub;
    rawValue : string;
    value;

    onValueChanged = undefined;

    constructor(protected iot : IotService) {
    }
  
    init(hubUuid, uuid, variable){
        this.uuid = uuid;
        this.hubUuid = hubUuid;
        this.variable = variable;
        if (typeof this.variable.value == 'string')
            this.variable.value = JSON.parse(this.variable.value);
    }

    ngAfterViewInit(){
        this.iot.onConnected(() => {
            this.sub = this.iot.subscribe("EventDeviceUpdate", { uuid: this.uuid }, (data) => {
                for (let key in data.variables){
                    let variable = data.variables[key];
                    if (variable.href == this.getResource()){
                        this.rawValue = variable.value;
                        this.variable.value = JSON.parse(variable.value);
                        if (this.onValueChanged != undefined){
                            this.onValueChanged(this.variable.value);
                        }
                    }
                }
            });
        });
    }

    getName(){
        return this.variable["n"];
    }

    getResource(){
        return this.variable["href"];
    }

    isReadOnly(){
        return this.variable["if"] === "oic.if.r";
    }
}

