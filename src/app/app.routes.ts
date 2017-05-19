import { LoginComponent } from "./login.component";
import { HomeComponent } from "./home.component";

export const ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login',  component: LoginComponent},
  { path: 'home',    component: HomeComponent},
];