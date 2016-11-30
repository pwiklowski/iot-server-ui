import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { ClassUtils } from './class.utils';


@Component({
    selector: '[wmWidgets]',
    template: `<div #container>widgets </div>`,
})
export class WidgetsComponent {
    panel;
    translateTime = 300;

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    window = undefined;
    componentFactoryResolver: ComponentFactoryResolver;

    transformOpen = "translateY(1200px)";
    transformClosed = "translateY(0px)";

    customWindowClass = "wm-window-script";


    constructor(componentFactoryResolver: ComponentFactoryResolver) {
        this.panel = document.getElementById("iot-widgets");
        this.componentFactoryResolver = componentFactoryResolver;
    }

    attach(component, callback, detachCallback) : any{ 
        setTimeout(()=>{
            let factory = this.componentFactoryResolver.resolveComponentFactory(component);
            let c = this.container.createComponent(factory);  

            let w = c.location.nativeElement;
            w.setAttribute("class", "iot-widget");

            this.window = w;
            callback(c);

            this.show(w);

        }, this.translateTime);
    }

    hide(window){
        if(window != undefined){
            window.style.transform = this.transformOpen;
            window.style.opacity = "0";
            setTimeout(()=>{
                 this.container.clear();
                 this.window = undefined;
            
            }, this.translateTime);
        }
    }
    show(window){
        if(window != undefined){
            window.style.transform = this.transformClosed;
            window.style.opacity = "100";
        }
    }

}
