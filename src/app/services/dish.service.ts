import { Injectable } from '@angular/core';
import { Dish } from '../shared/dishes';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ErrorProcessorService } from './error-processor.service';
import { map, catchError } from 'rxjs/operators';

interface recImage {
  success: boolean;
  image: string;
}

interface addDishOrder {
  success: boolean;
  message: string;
}

interface resDish {
  success: boolean;
  dishes: Dish[];
}

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient, private errorProcessor: ErrorProcessorService) { }

  addImage(image: FormData): Observable<any> {
    return this.http.post<recImage>(baseURL + '/dish/addImage', image)
      .pipe(map(res => {
        return ({ 'success': res.success, 'image': res.image })
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  addDish(dish: Dish): Observable<any> {

    return this.http.post<any>(baseURL + '/dish/addDish', dish)
      .pipe(map(res => {
        return ({ 'success': res.success, 'message': res.message });
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  getDishes(): Observable<any> {
    return this.http.get<resDish>(baseURL + '/dish/getDishes')
      .pipe(map(res => {
        return ({ 'success': res.success, 'dishes': res.dishes });
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  getFeaturedDishes(): Observable<any> {
    return this.http.get<resDish>(baseURL + '/dish/featuredDishes')
      .pipe(map(res => {
        return ({ 'success': res.success, 'dishes': res.dishes });
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  addOrder(id: string): Observable<any> {
    return this.http.put<addDishOrder>(baseURL + '/user/addOrder', { 'id': id })
      .pipe(map(res => {
        return ({ 'success': res.success, 'message': res.message });
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(baseURL + '/dish/orders')
      .pipe(map(res => {
        return ({ 'success': res.success, 'message': res.message, 'orders': res.orders });
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  removeOrder(id: string): Observable<any> {
    return this.http.delete<any>(baseURL + "/dish/removeOrder/" + id)
      .pipe(map(res => {
        return ({ 'success': res.success, 'message': res.message });
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

}
