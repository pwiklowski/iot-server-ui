import {Component, ViewChild, ViewContainerRef, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {IotService} from './iot.service';

@Component({
  selector: 'logs',
  template: `
    <div #logsContainer class="iot-device-logs">
      <div #logsList>
        <div *ngFor="let log of logs">
          {{log}}
        </div>
      </div>

    </div>  
  `,
  styles:[`
    .iot-device-logs{
      height: 200px;
      overflow-y: scroll;
      display: flex;
      flex-flow: column;
      font-size: 11px;
      line-height: 12px;
      font-family: monospace;
    }

  `]
})
export class LogsComponent {
  sub : any;
  logs = [];
  @Input() deviceId: string;
  @ViewChild('logsContainer', { read: ViewContainerRef }) logsContainer: ViewContainerRef;
  @ViewChild('logsList', { read: ViewContainerRef }) logsList: ViewContainerRef;

  constructor(private iot : IotService) {}

  ngOnInit() {
    this.sub = this.iot.subscribe("EventValueUpdate", { uuid: this.deviceId }, (data) => {
      let today = new Date();
      let timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.logs.push("["+timestamp+"] " + data.resource + " " + JSON.stringify(data.value));

      this.logsContainer.element.nativeElement.scrollTop = this.logsList.element.nativeElement.clientHeight + 200;
    });
  }

  ngOnDestroy() {}

  clearLogs(){
    this.logs = [];
  }
}