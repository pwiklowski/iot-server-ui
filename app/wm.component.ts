import { Component, ViewChild, AfterViewInit, ApplicationRef, Injector, ComponentRef, DynamicComponentLoader,ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { DevicesComponent } from './devices.component';


@Component({
    selector: '[wm]',
    template: 'WM<div #container> </div>',
})
export class WMComponent {

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
  
    attach(component) : any{
        let factory = this.componentFactoryResolver.resolveComponentFactory(component);
        return this.container.createComponent(factory);
    }

    
}
