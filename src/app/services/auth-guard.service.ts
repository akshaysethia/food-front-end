import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminGaurdService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoginAndSignUp implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class NotAdmin implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      if (this.auth.isAdmin()) {
        this.router.navigate(['/menu']);
        return false;
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/menu']);
      return false;
    }
  }
}
