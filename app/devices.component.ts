import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'app',
    template:`devices`,
  directives: [ROUTER_DIRECTIVES]
   
})
export class DevicesComponent {
}
