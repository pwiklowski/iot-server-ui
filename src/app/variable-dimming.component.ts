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
        <mdl-slider #slider
          [(ngModel)]="value" 
          type="range"
          min="{{min}}"
          max="{{max}}"
          (ngModelChange)="updateValue($event)">
        </mdl-slider>
    </div>`
})
export class VariableLightDimmingComponent extends VariableComponent {
  max : number;
  min : number;

  @ViewChild('slider') slider; 
  
  init(hubUuid, uuid, variable) {
    super.init(hubUuid, uuid, variable);
    this.rawValue = JSON.stringify(variable.value);
    console.log(variable);

    this.min = variable.value["range"].split(",")[0];
    this.max = variable.value["range"].split(",")[1];
    
    setTimeout(()=>{
      this.value = variable.value["dimmingSetting"];
    }, 10); 

    this.onValueChanged = (data)=>{
      this.value = data.dimmingSetting;
    };
  }
  
  updateValue(value){
    let obj = {
      "dimmingSetting": parseInt(value)
    };
    this.iot.setValue(this.hubUuid, this.uuid, this.getResource(), obj);
  }
}
