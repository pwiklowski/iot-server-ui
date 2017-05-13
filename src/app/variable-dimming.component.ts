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
        <mdl-slider #slider
          [(ngModel)]="value" 
          type="range"
          min="{{min}}"
          max="{{max}}"
          [disabled]="isReadOnly()"
          (ngModelChange)="updateValue($event)">
        </mdl-slider>
    </div>`
})
export class VariableLightDimmingComponent extends VariableComponent {
  rawValue: string;
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
        this.value = data.value["dimmingSetting"];
        this.rawValue = JSON.stringify(data.value);
      });
    });
  }

  init(di, name, variable) {
    super.init(di, name, variable);
    this.rawValue = JSON.stringify(variable.values);
    this.min = variable.values["range"].split(",")[0];
    this.max = variable.values["range"].split(",")[1];
    
    setTimeout(()=>{
      this.value = variable.values["dimmingSetting"];
    }, 10); 
  }
  
  updateValue(value){
    let obj = {
      "dimmingSetting": parseInt(value)
    };
    this.iot.setValue(this.di, this.name, obj);
  }
}
