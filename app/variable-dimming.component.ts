import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { MapToIterable } from './pipes';
import { VariableComponent } from './variable.component';

import { IotService } from './iot.service';

@Component({
    selector: '[variable]',
    template: `
    <div class="iot-variable">
        <b>{{name}}</b><br>
        {{ value }}
        <input #slider [value]="value" type="range"
            min="{{min}}" max="{{max}}" (input)="onChange(slider.value)"/>
    </div>`
})
export class VariableLightDimmingComponent extends VariableComponent{
    value : number;
    max: number;
    min: number;

    sub;

    constructor(private iot: IotService){
        super();

        iot.onConnected(()=>{
            this.sub = iot.subscribe("VALUE", "", (data)=>{
                if (data.resource == this.name){ //TODO: move it to iot.service -> do not trigger callaback if not needed
                    this.value = data.value["dimmingSetting"];
                }
            });
        });
    }

    init(di, name, value){
        this.name = name;
        this.di = di;
        this.value = value["dimmingSetting"];
        this.min = value["range"].split(",")[0];
        this.max = value["range"].split(",")[1];
    }

    onChange(value){
        this.value = value;

        let obj = {
            "dimmingSetting": parseInt(value)
        };
        this.iot.setValue(this.di, this.name, obj);
    }
}

