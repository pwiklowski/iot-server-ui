import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { ClassUtils } from './class.utils';
import { WMComponent } from './wm.component';


@Component({
    selector: '[wm]',
    template: `<div #container> </div>`,
})
export class WMScriptsComponent extends WMComponent{
    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    transformOpen = "translateY(1200px)";
    transformClosed = "translateY(0px)";
    customWindowClass = "wm-window-script";


    constructor(componentFactoryResolver: ComponentFactoryResolver) {
        super(componentFactoryResolver);
        this.panel = document.getElementById("iot-content");
    }

}
