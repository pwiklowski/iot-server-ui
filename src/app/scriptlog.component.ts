import {Component, ViewChild, ViewContainerRef, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { IotService } from './iot.service';
import {LogsComponent} from './log.component';

@Component({
  selector: '[scriptlogs]',
  templateUrl: `
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
      line-height: 12px;
      overflow-y: scroll;
      display: flex;
      flex-flow: column;
      font-size: 11px;
      font-family: monospace;
    }

  `]
})
export class ScriptLogsComponent {
  sub : any;
  logs = [];
  @Input() deviceId: string;
  @ViewChild('logsContainer', { read: ViewContainerRef }) logsContainer: ViewContainerRef;
  @ViewChild('logsList', { read: ViewContainerRef }) logsList: ViewContainerRef;

  constructor(private iot : IotService) {}

  ngOnInit() {
    this.sub = this.iot.subscribe("EventLog", { }, (data) => {
      let today = new Date();
      let timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.logs.push("["+timestamp+"] " + data);

      this.logsContainer.element.nativeElement.scrollTop = this.logsList.element.nativeElement.clientHeight + 200;
    });
  }

  ngOnDestroy() {

  }

  clearLogs(){
    this.logs = [];
  }
}