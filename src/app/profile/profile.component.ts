import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name: string;
  email: string;
  veg: boolean;
  errMsg: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getProfile()
      .subscribe(res => {
        this.name = res.name;
        this.email = res.email;
        this.veg = res.veg;
      }, err => this.errMsg = <any>err);
  }

}
