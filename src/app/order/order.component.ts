import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dishes';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  errMsg: string = null;
  orders: any = null;
  cost: number = null;

  constructor(
    private dishService: DishService,
    @Inject('baseURL') public baseURL
  ) {}

  ngOnInit(): void {
    this.dishService.getOrders().subscribe(
      (data) => {
        if (data.success) {
          this.orders = data.orders;
          data.orders.forEach((order) => {
            this.cost += order.quantity * order.dish.cost;
          });
          if (data.orders.length > 0) {
            this.errMsg = data.message;
          } else {
            this.errMsg = 'No Orders !';
          }
        } else {
          this.orders = null;
          this.errMsg = data.message;
        }
        setTimeout(() => {
          this.errMsg = null;
        }, 3000);
      },
      (err) => console.log('An Error Occurred: ', err)
    );
  }

  removeDish(id: string) {
    this.dishService.removeOrder(id).subscribe(
      (data) => {
        this.errMsg = data.message;
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      (err) => (this.errMsg = <any>err)
    );
  }
}
