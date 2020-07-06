import { Component, OnInit, ViewChild } from "@angular/core";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { DataService } from "src/app/shared/data.service";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"],
})
export class AddressComponent implements OnInit {
  @ViewChild("formAddress", { static: true }) formAddress: NgForm;

  constructor(
    private sharingData: SharingDataService,
    private router: Router,
    private _dataService: DataService
  ) {}
  cart: any;
  cartNull: boolean = false;
  price: number;
  totalPriceOfAllProduct: any;
  totalPriceOfAllProductFormat: string;
  user: any;
  discountCodeHTML: any;
  ngOnInit() {
    this.showCart();
    this.showUserInfo();
    this.showDiscountCode();
  }
  showUserInfo() {
    if (sessionStorage.getItem("userKagu")) {
      console.log(this.formAddress.value);

      this.user = JSON.parse(sessionStorage.getItem("userKagu"));
      setTimeout(() => {
        this.formAddress.setValue({
          name: this.user.data.user.name,
          phone: this.user.data.user.phone,
          email: this.user.data.user.email,
          address: this.user.data.user.address,
        });
      });
    }
  }
  showDiscountCode() {
    if (sessionStorage.getItem("discountCode")) {
      this.discountCodeHTML = JSON.parse(
        sessionStorage.getItem("discountCode")
      );
      console.log(this.discountCodeHTML);

      this.calculateTotalPrice();
      this.enterDiscountCodeFunc(this.discountCodeHTML);
    } else {
      this.calculateTotalPrice();
    }
  }

  enterDiscountCodeFunc(code) {
    this.calculateTotalPrice();
    let uri = "data/check-discount-code";
    console.log(code);

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
      },
      (err: any) => {
        console.log(err);

        console.log("error");
      }
    );
  }
  showCart() {
    if (localStorage.getItem("cart")) {
      this.cart = JSON.parse(localStorage.getItem("cart"));
      console.log(this.cart);
    } else {
      this.cartNull = true;
    }
    this.sharingData.ShareCart.subscribe((data) => {
      if (data !== "0") {
        this.totalPriceOfAllProductFormat = data;
      } else {
        this.showDiscountCode();
      }
    });
    console.log(this.totalPriceOfAllProductFormat);
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
  }
  checkOut() {
    console.log(this.formAddress.value);
    this.sharingData.sharingDataOrderInfo(this.formAddress.value);

    this.router.navigate([`/thanh-toan`]);
  }
}
