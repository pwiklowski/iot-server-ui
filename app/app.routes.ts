import { provideRouter, RouterConfig } from '@angular/router';
import { DevicesComponent } from './devices.component';
import { ScriptComponent } from './script.component';

export const routes: RouterConfig = [
    { path: 'device/:id', component: DevicesComponent},
    { path: 'script/:id', component: ScriptComponent},
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
]
