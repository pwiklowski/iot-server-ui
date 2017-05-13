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
      <b>{{name}}</b>
      <div class="iot-device-raw-value">{{rawValue}}</div>
      <mdl-switch [(ngModel)]="value" (change)="onChange($event)"  [disabled]="isReadOnly()" ></mdl-switch>
    </div>`
})
export class VariableBinnaryComponent extends VariableComponent {
  rawValue : string;
  value : number = 0;
  max : number;
  min : number;

  sub;
  @ViewChild('slider') slider; 

  constructor(private iot : IotService) {
    super();

  }
  
  ngAfterViewInit(){
    this.iot.onConnected(() => {
      this.sub = this.iot.subscribe("EventValueUpdate", { di: this.di, resource: this.resource }, (data) => {
        this.value = data.value["value"];
        this.rawValue = JSON.stringify(data.value);
      });
    });
  }

  init(di, name, variable) {
    super.init(di, name, variable);
    
    setTimeout(()=>{
      this.value = variable.values["value"];
      this.rawValue = JSON.stringify(variable.values);
    }, 10); 
  }



  onChange(e){
    console.log(e);
    this.updateValue(e);
  }
 
  
  updateValue(value){
    let obj = {
      "value": value
    };
    this.iot.setValue(this.di, this.resource, obj);
  }
}
