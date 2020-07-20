import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { NgForm } from "@angular/forms";
// import { Location } from "@angular/common";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  @ViewChild("formDiscountCode", { static: false }) form: NgForm;
  cart: any;
  cartNull: boolean = true;
  price: number;
  totalPriceOfAllProduct: number = 0;
  totalPriceOfAllProductOrigin: string;
  totalPriceOfAllProductFormat: string;
  discountPercent: string;
  discountMoneyFormat: string;
  enterDiscountcode: boolean = false;
  discountCodeHTML;
  constructor(
    private _dataService: DataService,
    private router: Router,
    private sharingDataSerive: SharingDataService
  ) {}
  ngAfterViewInit() {}
  ngOnInit() {
    this.showCart();

    this.showDiscountCode();
  }
  showDiscountCode() {
    if (sessionStorage.getItem("discountCode")) {
      this.discountCodeHTML = JSON.parse(
        sessionStorage.getItem("discountCode")
      );

      this.enterDiscountCodeFunc(this.discountCodeHTML);
    } else {
      this.calculateTotalPrice();
    }
  }
  showCart() {
    if (localStorage.getItem("cart")) {
      this.cart = JSON.parse(localStorage.getItem("cart"));
      if (this.cart.length != 0) {
        this.cartNull = false;
      }
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
  deleteProduct(productId) {
    console.log("delete");
    console.log(productId);

    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].productId == productId) {
        this.cart.splice(i, 1);
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
    }
    if (this.cart.length == 0) {
      location.reload();
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
    }

    let temp, convert: number;
    temp = this.totalPriceOfAllProduct;
    convert = temp.toLocaleString("de-DE");
    this.totalPriceOfAllProductFormat = convert.toString();
    this.totalPriceOfAllProductOrigin = convert.toString();
  }
  checkOut() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.router.navigate([`/thong-tin-dat-hang`]);
    this.sharingDataSerive.sharingDataDetailCart(
      this.totalPriceOfAllProductFormat
    );
    this.sharingDataSerive.sharingDiscountCode(this.discountCodeHTML);
  }
  enterDiscountCodeFunc(code?) {
    if (this.enterDiscountcode == false) {
      this.calculateTotalPrice();
      let uri = "data/check-discount-code";
      console.log(code);
      if (!code) {
        code = this.form.value.discountCode;
      }
      console.log(code);
      let message = {
        discountCode: code,
        totalMoney: this.totalPriceOfAllProduct.toString(),
      };
      console.log(this.totalPriceOfAllProduct);

      this._dataService.post(uri, message).subscribe(
        (data: any) => {
          this.totalPriceOfAllProduct = data.data.lastMoney;
          this.totalPriceOfAllProductFormat = data.data.lastMoneyFormat;
          this.discountMoneyFormat = data.data.discountMoneyFormat;
          this.discountCodeHTML = code;
          this.enterDiscountcode = true;
          if (!sessionStorage.getItem("discountCode")) {
            sessionStorage.setItem(
              "discountCode",
              JSON.stringify(this.form.value.discountCode)
            );
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }
  deleteDiscountCode() {
    this.enterDiscountcode = true;
    location.reload();
    sessionStorage.removeItem("discountCode");
  }
}
