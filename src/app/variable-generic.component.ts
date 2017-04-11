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
        <b>{{href}}</b><br>
         <div class="iot-device-raw-value">{{values}}</div>
    </div>`,
})
export class VariableGenericComponent extends VariableComponent {
    href: String;
    values: any;
    init(name, href, values){
        this.name = name;
        this.href = href;
        this.values =  JSON.stringify(values);
    }
}


