import {Component, ViewContainerRef,ViewChild} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Device, DeviceVariable} from './models.ts';
import {Subscription} from 'rxjs/Subscription';
import {MapToIterable} from './pipes';
import {VariableComponent} from './variable.component';

import {IotService} from './iot.service';

@Component({
  selector: '[variable]',
  template: `
    <div class="iot-resource">
      <b>{{ getName() }}</b>
      <div class="iot-device-raw-value">{{rawValue}}</div>
      <mdl-switch [(ngModel)]="value" (change)="onChange($event)"  [disabled]="isReadOnly()" ></mdl-switch>
    </div>`
})
export class VariableBinnaryComponent extends VariableComponent {
  max : number;
  min : number;

  @ViewChild('slider') slider; 

  init(hubUuid, uuid, variable) {
    super.init(hubUuid, uuid, variable);
    
    setTimeout(()=>{
      this.value = variable.value["value"];
      this.rawValue = JSON.stringify(variable.value);
    }, 10); 

    this.onValueChanged = (data)=>{
      this.value = data.value;
    };
  }

  onChange(e){
    this.updateValue(e);
  }
  
  updateValue(value){
    let obj = {
      "value": value
    };
    this.iot.setValue(this.hubUuid, this.uuid, this.getResource(), obj);
  }
}
