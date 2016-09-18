import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { MapToIterable } from './pipes';
import { VariableComponent } from './variable.component';


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

    setValue(name, value){
        this.name = name;
        this.value = value["dimmingSetting"];
        this.min = value["range"].split(",")[0];
        this.max = value["range"].split(",")[1];
    }

    onChange(value){
        this.value = value;

        let obj = {
            "dimmingSetting": parseInt(value)
        };
        this.onValueChanged(this.name, obj);
    }
}

