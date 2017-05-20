import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { MapToIterable } from './pipes';


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
    resource: string;
    name: string;
    uuid: string;
    variable;

    init(uuid, variable){
        this.uuid = uuid;
        this.variable = variable;
        this.variable.value = JSON.parse(this.variable.value);
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

