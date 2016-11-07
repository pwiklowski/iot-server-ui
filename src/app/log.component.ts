import {Component, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {IotService} from './iot.service';

@Component({
  selector: '[logs]',
  templateUrl: `
    <div class="iot-device-logs">
      <div *ngFor="let log of logs">
        {{log}}
      </div>

    </div>  
  `,
  styles:[`
    .iot-device-logs{
      height: 200px;
      overflow: scroll;
      display: flex;
      flex-flow: column;
      font-size: 11px;
      font-family: monospace;
    }

  `]
})
export class LogsComponent {
  sub : any;
  logs = [];
  @Input() deviceId: string;

  constructor(private iot : IotService) {}

  ngOnInit() {
    this.sub = this.iot.subscribe("EventValueUpdate", { di: this.deviceId }, (data) => {
      console.log("[LOG]" + data.resource, data.value);
      this.logs.push("[LOG] " + data.resource, JSON.stringify(data.value));
    });
  }

  ngOnDestroy() {}
}