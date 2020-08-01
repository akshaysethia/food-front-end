import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dishes';
import { DishService } from '../services/dish.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  Dishes: Dish[];
  admin: Boolean = false;
  errMsg: string = null;

  constructor(
    private dishService: DishService,
    private authService: AuthService,
    private router: Router,
    @Inject('baseURL') public BaseURL
  ) {}

  ngOnInit(): void {
    this.dishService.getDishes().subscribe(
      (data) => {
        if (data.success) {
          this.Dishes = data.dishes;
        } else {
          this.Dishes = null;
        }
      },
      (err) => console.log('An Error Occured !', err)
    );

    this.admin = this.authService.isAdmin();
  }

  addDish(id: string) {
    if (this.authService.isLoggedIn()) {
      this.dishService.addOrder(id).subscribe(
        (data) => {
          this.errMsg = data.message;
          setTimeout(() => {
            this.errMsg = null;
          }, 3000);
        },
        (err) => (this.errMsg = <any>err)
      );
    } else {
      this.router.navigate(['/login']);
    }
  }
}
