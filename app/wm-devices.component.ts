import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, DynamicComponentLoader,ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { ClassUtils } from './class.utils';


@Component({
    selector: '[wmDevices]',
    template: `<div (window:keydown)="eventHandler($event)"></div>
        <div class="iot-script-container" #devContainer> </div>
    `,
})
export class WMDevicesComponent {
    offsetX = 0;
    offsetY = 0;
    panel;
    translateTime = 300;


    @ViewChild('devContainer', { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {

    }

    window;
  
    attach(component, callback) : any{ 
        this.hide(this.window);

        setTimeout(()=>{
            let factory = this.componentFactoryResolver.resolveComponentFactory(component);
            let c = this.container.createComponent(factory);  
            let w = c.location.nativeElement;
            w.setAttribute("class", "wm-window wm-window-device");

            let MARGIN = 15;
            this.window = w;
            callback(c);

            this.show(w);

        }, this.translateTime);
    }

    hide(window){
        if(window != undefined){
            window.style.transform = "translateX(500px)";
            window.style.opacity = "0";
            setTimeout(()=>{
                 this.container.clear();
            
            }, this.translateTime);
        }
    }
    show(window){
        if(window != undefined){
            window.style.transform = "translateX(0px)";
            window.style.opacity = "100";
        }
    }





}
