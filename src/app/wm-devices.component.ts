import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { ClassUtils } from './class.utils';
import { WMComponent } from './wm.component';


@Component({
    selector: '[wmDevices]',
    template: `<div class="iot-device-container" #devContainer> </div>`,
})
export class WMDevicesComponent extends WMComponent {

    @ViewChild('devContainer', { read: ViewContainerRef })
    container: ViewContainerRef;

    transformOpen = "translateX(500px)";
    transformClosed = "translateX(0px)";

    customWindowClass = "wm-window-device";

    constructor(componentFactoryResolver: ComponentFactoryResolver) {
        super(componentFactoryResolver);
    }
}
