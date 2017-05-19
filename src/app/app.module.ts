import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MdlModule } from 'angular2-mdl';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { IotService } from './iot.service';
import { AuthService } from './auth.service';
import { DeviceComponent } from './device.component';

import { WMScriptsComponent } from './wm-scripts.component';
import { WMDevicesComponent } from './wm-devices.component';
import { WidgetsComponent } from './widgets.component';
import { WidgetComponent } from './widget.component';
import { DevicesComponent} from './devices.component';
import { ScriptComponent} from './script.component';
import { DevicePickerComponent } from './devicepicker.component';

import { EventEditorDirective } from './eventeditor.directive';
import { CodeEditorDirective } from './codeeditor.component';

import { VariableColourRgbComponent } from './variable-rgb.component';
import { VariableLightDimmingComponent } from './variable-dimming.component';
import { VariableGenericComponent } from './variable-generic.component';
import { VariableBinnaryComponent } from './variable-binnary.component';
import { MapToIterable, DeviceAlias } from './pipes';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LogsComponent } from './log.component';
import { ScriptLogsComponent } from './scriptlog.component';

import { LoginComponent } from './login.component';
import { RouterModule} from '@angular/router';

@Pipe({
    name: 'sanitizeHtml'
})
class SanitizeHtml implements PipeTransform  {

   constructor(private _sanitizer: DomSanitizer){}  

   transform(v: string) : SafeHtml {
      return this._sanitizer.bypassSecurityTrustHtml(v); 
   } 
} 

@NgModule({
  imports: [ BrowserModule,
    FormsModule,
    MdlModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
    ],
  declarations: [
      AppComponent,
      HomeComponent,
      LoginComponent,
      DevicePickerComponent,
      DevicesComponent,
      ScriptComponent,
      SanitizeHtml,
      MapToIterable,
      DeviceAlias,
      VariableGenericComponent,
      VariableLightDimmingComponent,
      VariableColourRgbComponent,
      VariableBinnaryComponent,
      WMDevicesComponent,
      WMScriptsComponent,
      CodeEditorDirective,
      EventEditorDirective,
      LogsComponent,
      WidgetsComponent,
      WidgetComponent,
      ScriptLogsComponent
  ],

  entryComponents: [
      DevicesComponent,
      ScriptComponent,
      VariableGenericComponent,
      VariableLightDimmingComponent,
      VariableBinnaryComponent,
      VariableColourRgbComponent,
      WidgetsComponent,
      WidgetComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [ENV_PROVIDERS, IotService, AppComponent, AuthService],
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}

  hmrOnInit(store) {
    this.appRef.tick();
  }

  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

