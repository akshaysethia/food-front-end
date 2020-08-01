import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errMsg: string;
  user = {
    email: '',
    password: ''
  };
  loader: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.loader = !this.loader;
    this.authService.loginUser(this.user)
      .subscribe(res => {
        this.loader = !this.loader;
        if (res.success) {
          this.router.navigate(['/home']);
        } else {
          this.errMsg = <string>res.message;
        }
      }, err => {
        this.errMsg = <any>err;
      })
  }

}
