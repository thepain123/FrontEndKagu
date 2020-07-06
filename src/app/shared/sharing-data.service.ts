import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SharingDataService {
  private cart = new BehaviorSubject("0");
  private totalPrice = new BehaviorSubject(0);
  private orderInfo = new BehaviorSubject({} as Object);
  private orderId = new BehaviorSubject(0);
  private catid = new BehaviorSubject(0);
  private searchKeyword = new BehaviorSubject("0");
  private typeload = new BehaviorSubject(0);
  private flag = new BehaviorSubject(1);
  private discountCode = new BehaviorSubject("0");

  ShareCart = this.cart.asObservable();
  ShareTotalPrice = this.totalPrice.asObservable();
  ShareOrderInfo = this.orderInfo.asObservable();
  ShareOrderID = this.orderId.asObservable();
  ShareCatID = this.catid.asObservable();
  ShareKeyword = this.searchKeyword.asObservable();
  ShareTypeLoad = this.typeload.asObservable();
  LoadHTML = this.flag.asObservable();
  ShareDiscountCode = this.discountCode.asObservable();

  constructor() {}
  sharingDataDetailCart(total: string) {
    this.cart.next(total);
  }
  sharingDataOrderInfo(order) {
    this.orderInfo.next(order);
  }
  sharingDataTotalPrice(totalPrice) {
    this.orderInfo.next(totalPrice);
  }
  sharingDataOrderID(orderid) {
    this.orderId.next(orderid);
  }

  sharingTypeLoad(typeload) {
    this.typeload.next(typeload);
  }
  loadingFlag(flag) {
    this.flag.next(flag);
  }

  sharingDiscountCode(discountCode) {
    this.discountCode.next(discountCode);
  }
}
