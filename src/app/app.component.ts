import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'application',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor() {

  }

  public ngOnInit() {
    console.log('Initial App State');
  }

}