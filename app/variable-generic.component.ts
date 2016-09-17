import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceValue, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { MapToIterable } from './pipes';


@Component({
    selector: '[variable]',
    template: `
    <div>
        {{variable.name}}
        <div *ngFor="let v of variable.values | mapToIterable">
            {{v.key}}: {{ v.value}}
        </div>
    </div>`,
})
export class VariableGenericComponent {
    variable: DeviceVariable;
}

