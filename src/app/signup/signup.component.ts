import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/users';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('suForm') signupDirective;
  signupForm: FormGroup;
  signup: User;
  errMsg: string;
  loader: boolean = false;

  formErrors = {
    'name': '',
    'email': '',
    'password': ''
  };

  validationMessages = {
    'name': {
      'required': 'name is Required !',
      'minlength': 'name should be atleast 5 chars',
      'maxlength': 'name was asked, not an essay !'
    },
    'email': {
      'required': 'email is required !',
      'email': 'email not in valid format.'
    },
    'password': {
      'required': 'password is required !',
      'minlength': 'password should be atleast 6 chars',
      'maxlength': 'password was asked, not an essay !'
    }
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      admin: [ false, [Validators.required]],
      veg: [ false, [Validators.required]]
    });

    this.signupForm.valueChanges
      .subscribe(data => this.onValueChange(data));

    this.onValueChange();
  }

  onValueChange(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '\n';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.loader = !this.loader;
    this.signup = this.signupForm.value;
    this.authService.signup(this.signup)
      .subscribe(data => {
        if (data.success) {
          this.errMsg = <string>data.message;
          setTimeout(() => {
            this.loader = !this.loader;
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.loader = !this.loader;
          this.errMsg = <string>data.message;
        }
      }, err => console.log('An Error Occured !', err));

    this.signupForm.reset();
    this.signupDirective.resetForm();
  }

  reset() {
    this.signupForm.reset();
  }

}
