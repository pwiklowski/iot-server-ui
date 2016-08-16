import { Component, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'app',
    template:`<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {
}
