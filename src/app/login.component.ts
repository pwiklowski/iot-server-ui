import {Component, ViewChild, ElementRef} from '@angular/core';
import {IotService} from './iot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "./auth.service";

@Component({selector: 'login', template:`login` })
export class LoginComponent {
  constructor(private iot : IotService, private router: Router, private auth: AuthService) {
   router.events.subscribe(s => {
        let params = new URLSearchParams(s.url.split('#')[1]);
        let access_token = params.get('access_token');
        auth.setToken(access_token)

        router.navigate(["/"]);
    });
  }
}
