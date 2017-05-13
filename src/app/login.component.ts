import {Component, ViewChild, ElementRef} from '@angular/core';
import {IotService} from './iot.service';

@Component({selector: 'login', template:`login` })
export class LoginComponent {
  constructor(private iot : IotService) {
  }
}
