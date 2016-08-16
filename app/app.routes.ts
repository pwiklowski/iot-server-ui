import { provideRouter, RouterConfig } from '@angular/router';
import { DevicesComponent } from './devices.component';

export const routes: RouterConfig = [
    { path: '', component: DevicesComponent},
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
]
