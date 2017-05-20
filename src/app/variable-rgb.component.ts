import {Component, ViewChild, ElementRef} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Device, DeviceVariable} from './models.ts';
import {Subscription} from 'rxjs/Subscription';
import {MapToIterable} from './pipes';
import {VariableComponent} from './variable.component';
import {IotService} from './iot.service';

@Component({selector: '[variable]', template: `
    <div class="iot-resource">
        <b>{{ getName() }}</b>
        <div class="iot-device-raw-value">{{rawValue}}</div>
        Red:<br>
        <mdl-slider #r 
          type="range"
          min="0"
          max="255"
          [(ngModel)]="red" 
           [disabled]="isReadOnly()" 
          (ngModelChange)="onChange(r, $event)"> 
        </mdl-slider>
        Green:<br>
        <mdl-slider #g type="range" min="0" max="255"
          [(ngModel)]="green" 
           [disabled]="isReadOnly()" 
          (ngModelChange)="onChange(g, $event)"> 
        </mdl-slider>
        Blue:<br>
        <mdl-slider #b type="range" min="0" max="255"
          [(ngModel)]="blue" 
           [disabled]="isReadOnly()" 
          (ngModelChange)="onChange(b, $event)">
        </mdl-slider>
    </div>`})
export class VariableColourRgbComponent extends VariableComponent {
  rawValue: string;
  red : number = 0;
  green : number = 0;
  blue : number = 0;
  
  @ViewChild('r') r;
  @ViewChild('g') g;
  @ViewChild('b') b;

  sub;

  constructor(private iot : IotService) {
    super();
  }
  ngAfterViewInit(){
    this.iot.onConnected(() => {
      this.sub = this.iot.subscribe("EventValueUpdate", { di: this.uuid, resource: this.name }, (data) => {
        this.setValues(data.value);
        this.rawValue = JSON.stringify(data.value);
      });
    });
  }

  init(uuid, variable) {
    super.init(uuid, variable);

    this.rawValue = JSON.stringify(variable.value);
    setTimeout(()=>{
      this.setValues(variable.value);
    }, 100); 
  }

  setValues(value) {
    let values = value["dimmingSetting"].split(",");
    this.red = parseInt(values[0]);
    this.green = parseInt(values[1]);
    this.blue = parseInt(values[2]);
  }
  
  onChange(slider, value){
    let v = parseInt(value);
    if(slider === this.r) this.updateValue(v, this.green, this.blue);
    if(slider === this.g) this.updateValue(this.red, v, this.blue);
    if(slider === this.b) this.updateValue(this.red, this.green, v);
  }

  updateValue(red, green, blue){
    let obj = {
      "dimmingSetting": red + "," + green + "," + blue
    };
    this.iot.setValue(this.uuid, this.name, obj);
  }
}
