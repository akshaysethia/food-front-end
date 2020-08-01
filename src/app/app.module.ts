import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileComponent } from './profile/profile.component';
import { AddDishComponent } from './add-dish/add-dish.component';
import { OrderComponent } from './order/order.component';
import { ErrorPageComponent } from './error-page/error-page.component';

import { ErrorProcessorService } from './services/error-processor.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService, AdminGaurdService, LoginAndSignUp, NotAdmin } from './services/auth-guard.service';
import { AuthInterceptor, UnauthorizedInterceptor } from './services/auth.interceptor';
import { DishService } from './services/dish.service';
import { baseURL } from './shared/baseurl';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    MenuComponent,
    ProfileComponent,
    AddDishComponent,
    OrderComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ErrorProcessorService,
    AuthService,
    AuthGuardService,
    AdminGaurdService,
    LoginAndSignUp,
    NotAdmin,
    DishService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    { provide: 'baseURL', useValue: baseURL }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
