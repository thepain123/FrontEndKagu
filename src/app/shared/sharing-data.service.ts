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

  ShareCart = this.cart.asObservable();
  ShareTotalPrice = this.totalPrice.asObservable();
  ShareOrderInfo = this.orderInfo.asObservable();
  ShareOrderID = this.orderId.asObservable();
  ShareCatID = this.catid.asObservable();
  ShareKeyword = this.searchKeyword.asObservable();
  ShareTypeLoad = this.typeload.asObservable();

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
  sharingDataCatID(_catid) {
    this.catid.next(_catid);
  }
  sharingDataKeyword(_searchKeyword) {
    console.log("share key");

    this.searchKeyword.next(_searchKeyword);
  }
  sharingTypeLoad(typeload) {
    this.typeload.next(typeload);
  }
}
