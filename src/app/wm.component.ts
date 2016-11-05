import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { ClassUtils } from './class.utils';


@Component({
    selector: '[wm]',
    template: `<div (window:resize)="redraw()" #container> </div>`,
})
export class WMComponent {
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
        this.panel = document.getElementById("iot-content");
        this.componentFactoryResolver = componentFactoryResolver;
    }

    attach(component, callback, detachCallback) : any{ 
        this.hide(this.window);

        setTimeout(()=>{
            let factory = this.componentFactoryResolver.resolveComponentFactory(component);
            let c = this.container.createComponent(factory);  


            let w = c.location.nativeElement;
            w.setAttribute("class", "wm-window " + this.customWindowClass);


            this.window = w;
            this.redraw();
            callback(c);

            this.show(w);

            (<any>c.instance).onClose = () => {
                this.hide(this.window);
                detachCallback();
            };

        }, this.translateTime);
    }

    redraw(){
        console.log("redraw " + this.customWindowClass);;
        let MARGIN = 15;
        if (this.window)
            this.window.style.height = (this.panel.offsetHeight - 4*MARGIN)+ "px";
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
