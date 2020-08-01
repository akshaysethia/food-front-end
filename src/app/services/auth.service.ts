import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorProcessorService } from './error-processor.service';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../shared/users';
import { baseURL } from '../shared/baseurl';

interface LogUser {
  success: boolean;
  message: string;
  token: string;
  user: {
    name: string;
    email: string;
    admin: boolean;
    veg: boolean;
  };
}

interface Profile {
  user: {
    name: string;
    email: string;
    admin: boolean;
    veg: boolean;
  }
}

interface JWTResponse {
  success: boolean;
  message: string;
  user: {
    name: string;
    email: string;
    admin: boolean;
    veg: boolean;
  };
}

interface Register {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  tokenKey = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;
  admin: Boolean = false;

  constructor(private http: HttpClient, private errorProcessor: ErrorProcessorService) { }

  loadUserCredentials() {
    const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    if (credentials && credentials.name !== undefined) {
      this.useCredentials(credentials);
      if (this.authToken) {
        this.checkJWTtoken();
      }
    }
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + '/user/checkToken')
      .subscribe(res => {
        this.sendUsername(res.user.name);
      }, err => {
        this.destroyUserCedentials();
      });
  }

  storeUserCredentials(credentials: any) {
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.admin = credentials.admin;
    this.sendUsername(credentials.name);
    this.authToken = credentials.token;
  }

  sendUsername(name: string) {
    this.username.next(name);
  }

  loginUser(user: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<LogUser>(baseURL + '/user/login', user, httpOptions)
      .pipe(map(res => {
        if (res.success) {
          this.storeUserCredentials({ name: res.user.name, token: res.token, admin: res.user.admin });
          return { 'success': res.success, 'name': res.user.name };
        } else {
          return { 'success': res.success, 'message': res.message };
        }
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  signup(user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Register>(baseURL + '/user/register', user, httpOptions)
      .pipe(map(res => {
        return { 'success': res.success, 'message': res.message };
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  getProfile(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<Profile>(baseURL + '/user/profile')
      .pipe(map(res => {
        if (res.user) {
          return { 'name': res.user.name, 'email': res.user.email, 'admin': res.user.admin, 'veg': res.user.veg };
        }
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  destroyUserCedentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  logOut() {
    this.destroyUserCedentials();
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getToken(): string {
    return this.authToken;
  }

  isAdmin(): Boolean {
    return this.admin;
  }
}