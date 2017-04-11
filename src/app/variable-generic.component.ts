import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { VariableComponent } from './variable.component';
@Component({
    selector: '[variable]',
    template: `
    <div>
        <b>{{name}}</b><br>
         <div class="iot-device-raw-value">{{values}}</div>
    </div>`,
})
export class VariableGenericComponent extends VariableComponent {
    values: any;
    init(name, href, variables){
        super.init(name, href, variables);
        this.values =  JSON.stringify(variables.values);
    }
}

