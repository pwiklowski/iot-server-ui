import {Component, ViewChild, ViewContainerRef, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { IotService } from './iot.service';
import {LogsComponent} from './log.component';

@Component({
  selector: '[scriptlogs]',
  templateUrl: `
    <div #logsContainer class="iot-device-logs">
      <div class="iot-device-logs-handle" (click)="toggleLogsSize()">
        <mdl-icon *ngIf="!logsOpen">keyboard_arrow_up</mdl-icon>
        <mdl-icon *ngIf="logsOpen" >keyboard_arrow_down</mdl-icon>
      </div>
      <div #logsList>
        <div *ngFor="let log of logs">
          {{log}}
        </div>
      </div>

    </div>  
  `,
  styles:[`
    .iot-device-logs{
      height: 80px;
      line-height: 12px;
      overflow-y: scroll;
      display: flex;
      flex-flow: column;
      font-size: 11px;
      font-family: monospace;
      background-color: rgba(255, 255, 255, 100);
      transition: all 200ms ease-out;
      margin: 0 10px;
      border: 1px solid gray;
    }
    .iot-device-logs-handle{
      height: 20px;
      padding: 0 40px;
      background-color:white;
      border-top: 1px solid gray;
      border-left: 1px solid gray;
      border-right: 1px solid gray;
      top: -20px;
      position: absolute;
      left: calc(50% - 55px);
      cursor: pointer;
    }


  `]
})
export class ScriptLogsComponent {
  sub : any;
  logs = [];
  logsOpen: boolean = false;
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

  toggleLogsSize(){
      if( this.logsContainer.element.nativeElement.style.height == "400px"){
        this.logsContainer.element.nativeElement.style.height = "80px";
        this.logsOpen =false;
      }else{
        this.logsContainer.element.nativeElement.style.height = "400px";
        this.logsOpen = true;
      }
  }

  clearLogs(){
    this.logs = [];
  }
}