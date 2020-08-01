import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService, AdminGaurdService, LoginAndSignUp, NotAdmin } from './services/auth-guard.service';
import { AddDishComponent } from './add-dish/add-dish.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginAndSignUp] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginAndSignUp] },
  { path: 'menu', component: MenuComponent },
  { path: 'order', component: OrderComponent, canActivate: [NotAdmin] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'adddish', component: AddDishComponent, canActivate: [AuthGuardService ,AdminGaurdService] },
  { path: '404', component: ErrorPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
