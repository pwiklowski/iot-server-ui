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
        <b>{{ getName() }}</b><br>
         <div class="iot-device-raw-value">{{values}}</div>
    </div>`,
})
export class VariableGenericComponent extends VariableComponent {
    values: any;
    init(hubUuid, uuid, variable){
        super.init(hubUuid, uuid, variable);
        this.values =  JSON.stringify(variable.value);
    }
}

