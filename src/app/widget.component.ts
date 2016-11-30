import {Component, ViewChild, ElementRef} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Device, DeviceVariable} from './models.ts';
import {Subscription} from 'rxjs/Subscription';
import {MapToIterable} from './pipes';
import {VariableComponent} from './variable.component';
import {IotService} from './iot.service';

@Component({
  selector: '[widget]',
  styles:[`
    .iot-widget-card{
      min-height: 50px;
    }
  `],
  template: `
<mdl-card class="iot-widget-card" mdl-shadow="2" mdl-card-expand>
  <mdl-card-title>
    <h2 mdl-card-title-text>{{widgetData.Name}}</h2>
  </mdl-card-title>

  <mdl-card-actions mdl-card-border>
    <template ngFor let-action [ngForOf]="widgetData.Actions">
      <button mdl-button mdl-colored mdl-ripple (click)="callAction(action.Values)"> {{ action.Name}}</button>
    </template>
  </mdl-card-actions>
</mdl-card>
    `
  })
export class WidgetComponent{
  widgetData = {};
  actions = [];


  constructor(private iot : IotService) {

  }

  init(widget){
    console.log(widget);
    this.widgetData = widget;
  }

 callAction(action){
    action.forEach((a)=>{
      console.log(JSON.parse(a.Value));
      this.iot.setValue(a.DeviceUuid, a.Variable, JSON.parse(a.Value));
    });
  }
}
