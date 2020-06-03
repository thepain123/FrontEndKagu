import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";
import { SharingDataService } from "src/app/shared/sharing-data.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  cart: any;
  cartNull: boolean = false;
  price: number;
  totalPriceOfAllProduct: number = 0;
  totalPriceOfAllProductFormat: string;
  constructor(
    private _dataService: DataService,
    private router: Router,
    private sharingDataSerive: SharingDataService
  ) {}

  ngOnInit() {
    this.showCart();
    this.calculateTotalPrice();
  }

  showCart() {
    if (localStorage.getItem("cart")) {
      this.cart = JSON.parse(localStorage.getItem("cart"));
      for (let i = 0; i < this.cart.length; i++) {
        let temp, convert: number;
        temp = +this.cart[i].totalPrice;
        convert = temp.toLocaleString("de-DE");
        this.cart[i] = { ...this.cart[i], totalPriceFormat: convert };
      }
    } else {
      this.cartNull = true;
    }
  }

  raiseQuantity(productId) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].productId == productId) {
        if (this.cart[i].quantity < 100) {
          this.cart[i].quantity = ++this.cart[i].quantity;
          this.cart[i].totalPrice =
            this.cart[i].priceNum * this.cart[i].quantity;
          let temp, convert: number;
          temp = +this.cart[i].totalPrice;
          convert = temp.toLocaleString("de-DE");
          this.cart[i] = { ...this.cart[i], totalPriceFormat: convert };
        }
      }
    }
    this.calculateTotalPrice();
  }
  reduceQuantity(productId) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].productId == productId) {
        if (this.cart[i].quantity > 1) {
          this.cart[i].quantity = --this.cart[i].quantity;
          this.cart[i].totalPrice =
            this.cart[i].priceNum * this.cart[i].quantity;
          let temp, convert: number;
          temp = +this.cart[i].totalPrice;
          convert = temp.toLocaleString("de-DE");
          this.cart[i] = { ...this.cart[i], totalPriceFormat: convert };
          console.log(this.cart);
        }
      }
    }
    this.calculateTotalPrice();
  }
  calculateTotalPrice() {
    this.totalPriceOfAllProduct = 0;
    for (let i = 0; i < this.cart.length; i++) {
      this.totalPriceOfAllProduct += this.cart[i].totalPrice;
      let temp, convert: number;
      temp = this.totalPriceOfAllProduct;
      convert = temp.toLocaleString("de-DE");
      this.totalPriceOfAllProductFormat = convert.toString();
    }
  }
  checkOut() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.router.navigate([`/thong-tin-dat-hang`]);
    this.sharingDataSerive.sharingDataDetailCart(
      this.totalPriceOfAllProductFormat
    );
  }
}
