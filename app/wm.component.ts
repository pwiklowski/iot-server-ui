import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, DynamicComponentLoader,ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { ClassUtils } from './class.utils';


@Component({
    selector: '[wm]',
    template: `<div (window:resize)="redraw()" (window:keydown)="eventHandler($event)"></div>
        <div #container> </div>
    `,
})
export class WMComponent {
    offsetX = 0;
    offsetY = 0;
    panel;
    translateTime = 300;


    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    window = undefined;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        this.panel = document.getElementById("iot-content");
    }

    attach(component, callback, detachCallback) : any{ 
        this.hide(this.window);

        setTimeout(()=>{
            let factory = this.componentFactoryResolver.resolveComponentFactory(component);
            let c = this.container.createComponent(factory);  


            let w = c.location.nativeElement;
            w.setAttribute("class", "wm-window wm-window-script");


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
        let MARGIN = 15;
        this.window.style.height = (this.panel.offsetHeight - 4*MARGIN)+ "px";
    }

    hide(window){
        if(window != undefined){
            window.style.transform = "translateY(1200px)";
            window.style.opacity = "0";
            setTimeout(()=>{
                 this.container.clear();
                 this.window = undefined;
            
            }, this.translateTime);
        }
    }
    show(window){
        if(window != undefined){
            window.style.transform = "translateY(0px)";
            window.style.opacity = "100";
        }
    }

}
