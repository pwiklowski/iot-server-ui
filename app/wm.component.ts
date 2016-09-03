import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector,
         ComponentRef, DynamicComponentLoader,ComponentFactoryResolver,
         ViewContainerRef } from '@angular/core';



@Component({
    selector: '[wm]',
    template: `
        <div #container> </div>
    `,
})
export class WMComponent {

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    windows: Array<any> = new Array<any>();

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
}
