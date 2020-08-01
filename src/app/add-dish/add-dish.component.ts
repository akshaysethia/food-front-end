import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dishes';
import { Router } from '@angular/router';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css'],
})
export class AddDishComponent implements OnInit {
  @ViewChild('adForm') signupDirective;
  addDishForm: FormGroup;
  dish: Dish;
  errMsg: string;
  loader: boolean = false;
  image: File = null;

  formErrors = {
    name: '',
    description: '',
    places: '',
  };

  validationMessages = {
    name: {
      required: 'name is Required !',
      minlength: 'name should be atleast 3 chars',
      maxlength: 'name was asked, not an essay !',
    },
    description: {
      required: 'description is required !',
      minlength: 'description should be atleast 6 chars',
      maxlength: 'description was asked, not an essay !',
    },
    places: {
      required: 'places is required !',
      minlength: 'places should be atleast 5 chars',
      maxlength: 'places was asked, not an essay !',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dishService: DishService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.addDishForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      cost: [50, [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000),
        ],
      ],
      featured: [false, [Validators.required]],
      veg: [true, [Validators.required]],
      places: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
    });

    this.addDishForm.valueChanges.subscribe((data) => this.onValueChange(data));

    this.onValueChange();
  }

  handleFileInput(files: FileList) {
    this.image = files.item(0);
  }

  onValueChange(data?: any) {
    if (!this.addDishForm) {
      return;
    }
    const form = this.addDishForm;
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
    this.dish = this.addDishForm.value;
    const formData = new FormData();
    formData.append('image', this.image);
    this.dishService.addImage(formData).subscribe(
      (data) => {
        if (data.success) {
          this.dish.image = data.image;
          this.dishService.addDish(this.dish).subscribe(
            (data) => {
              if (data.success) {
                alert('Dish Added !');
                setTimeout(() => {
                  this.loader = !this.loader;
                  this.router.navigate(['/menu']);
                }, 2000);
              } else {
                this.loader = !this.loader;
                this.router.navigate(['/home']);
              }
            },
            (err) => console.log('An Error Occured !', err)
          );
        } else {
          this.dish.image = '/images/default.jpg';
          this.dishService.addDish(this.dish).subscribe(
            (data) => {
              if (data.success) {
                alert('Dish Added !');
                setTimeout(() => {
                  this.loader = !this.loader;
                  this.router.navigate(['/menu']);
                }, 2000);
              } else {
                this.loader = !this.loader;
                this.router.navigate(['/home']);
              }
            },
            (err) => console.log('An Error Occured !', err)
          );
        }
      },
      (err) => console.log('An Error Occured !', err)
    );

    this.addDishForm.reset();
    this.signupDirective.resetForm();
  }

  reset() {
    this.addDishForm.reset();
  }
}
