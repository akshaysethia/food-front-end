import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dishes';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Dishes: Dish[] = null;
  admin: Boolean = false;

  constructor(private dishService: DishService, private authService: AuthService, @Inject('baseURL') public BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDishes()
      .subscribe(data => {
        if (data.success) {
          this.Dishes = data.dishes;
        } else {
          this.Dishes = null;
        }
      }, err => console.log('An Error Occured !', err));

      this.admin = this.authService.isAdmin();
  }

}
