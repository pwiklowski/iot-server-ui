import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, DynamicComponentLoader,ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';

import { ClassUtils } from './class.utils';


@Component({
    selector: '[wm]',
    template: `<div (window:keydown)="eventHandler($event)"></div>
        <div #container> </div>
    `,
})
export class WMComponent {

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    windows: Array<any> = new Array<any>();

    activeWindow: number = 0;

    clear(){
        this.container.clear();
        this.windows = [];
    }
  
    attach(component) : any{
        let factory = this.componentFactoryResolver.resolveComponentFactory(component);

        let c = this.container.createComponent(factory);  

        c.location.nativeElement.setAttribute("class", "wm-window");

        this.windows.push(c);
        return c;
    }
    eventHandler(event) {
       console.log(event, event.keyCode, event.keyIdentifier);

       if (event.keyCode == 9){
           this.switchView(); 
           event.preventDefault();
       }
    }

    switchView(){
        this.activeWindow++;

        if (this.activeWindow >= this.container.length)
            this.activeWindow = 0;

        let content = document.getElementById('iot-content');
        
        let width = content.offsetWidth;
        var scroll = content.scrollLeft;

        for(let i=0; i<this.container.length; i++){
            let element = this.windows[i].location.nativeElement;

            let rightBorder = element.offsetLeft + element.offsetWidth - 70;
            let leftBorder = element.offsetLeft -70;


            if (i == this.activeWindow){
                console.log(width + " " + scroll + " " + leftBorder + " " +  rightBorder);
                ClassUtils.addClass(element, "wm-window-selected");

                if ((scroll + width) < rightBorder){
                    content.scrollLeft = rightBorder - width + 10;
                }else if (scroll > leftBorder){
                    content.scrollLeft = leftBorder - 10;
                }


            } else {
                ClassUtils.removeClass(element, "wm-window-selected");
            }
        }
        console.log("switchView " + this.activeWindow + " " + this.container.length);
    }
}
