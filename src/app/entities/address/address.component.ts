import { Component, OnInit, ViewChild } from "@angular/core";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"],
})
export class AddressComponent implements OnInit {
  @ViewChild("formAddress", { static: true }) formAddress: NgForm;
  constructor(
    private sharingData: SharingDataService,
    private router: Router
  ) {}
  cart: any;
  cartNull: boolean = false;
  price: number;
  totalPriceOfAllProduct: any;
  totalPriceOfAllProductFormat: string;
  user: any;
  ngOnInit() {
    this.showCart();
    this.showUserInfo();
  }
  showUserInfo() {
    if (localStorage.getItem("user")) {
      console.log(this.formAddress.value);

      this.user = JSON.parse(localStorage.getItem("user"));
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
        this.calculateTotalPrice();
      }
    });
    console.log(this.totalPriceOfAllProductFormat);
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
    console.log(this.formAddress.value);
    this.sharingData.sharingDataOrderInfo(this.formAddress.value);

    this.router.navigate([`/thanh-toan`]);
  }
}
