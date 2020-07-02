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
  totalPriceOfAllProductFormat: string;
  constructor(
    private _dataService: DataService,
    private router: Router,
    private sharingDataSerive: SharingDataService
  ) {}
  ngAfterViewInit() {}
  ngOnInit() {
    this.showCart();
    this.calculateTotalPrice();
  }
  ngDoCheck() {
    // this.ngOnInit();
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
      console.log("alo");
      location.reload();
      // window.location.reload;
      // this.router.navigateByUrl("/gio-hang");
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
  enterDiscountCode() {
    this.calculateTotalPrice;
    let uri = "data/check-discount-code";
    let message = {
      discountCode: this.form.value.discountCode,
      totalMoney: this.totalPriceOfAllProduct.toString(),
    };
    console.log(this.totalPriceOfAllProduct);

    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        this.totalPriceOfAllProduct = data.data.lastMoney;
        let temp, convert: number;
        console.log(this.totalPriceOfAllProduct);

        temp = this.totalPriceOfAllProduct;
        console.log(temp);
        convert = temp.toLocaleString("de-DE");
        this.totalPriceOfAllProductFormat = convert.toString();
      },
      (err: any) => {
        console.log(err);

        console.log("error");
      }
    );
    console.log(this.form.value);
  }
}
