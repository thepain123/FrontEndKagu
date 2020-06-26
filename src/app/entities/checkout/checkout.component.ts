import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { DataService } from "src/app/shared/data.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  cartInfo: any = {
    name: "string",
    phone: "string",
    email: "string",
    address: "string",
    deliveryOption: "Viet Nam Post",
    totalPrice: 0,
    paymentMethod: "cash",
  };
  cartProtect: any;
  orderID: number;
  temp: any;
  totalPriceOfAllProduct: number;
  constructor(
    private _dataService: DataService,
    private sharingData: SharingDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.calculateTotalPrice();

    this.sharingData.ShareOrderInfo.subscribe((data) => {
      this.temp = data;
      this.cartInfo.name = this.temp.name;
      this.cartInfo.phone = this.temp.phone;
      this.cartInfo.email = this.temp.email;
      this.cartInfo.address = this.temp.address;
    });
    console.log(this.cartInfo);
  }
  selectDeliveryOption(id) {
    switch (id) {
      case 1:
        this.cartInfo.deliveryOption = "Viet Nam Post";
        break;
      case 2:
        this.cartInfo.deliveryOption = "GHN Express";
        break;
      case 3:
        this.cartInfo.deliveryOption = "Viettel Post";
        break;

      default:
        break;
    }
    console.log(this.cartInfo);
  }
  selectCheckoutOption(id) {
    switch (id) {
      case 2:
        this.cartInfo.paymentMethod = "cash";
        break;
      case 3:
        this.cartInfo.paymentMethod = "paypal";
        break;

      default:
        break;
    }
    console.log(this.cartInfo);
  }
  calculateTotalPrice() {
    this.totalPriceOfAllProduct = 0;
    let cart = JSON.parse(localStorage.getItem("cart"));
    this.cartProtect = cart;
    for (let i = 0; i < cart.length; i++) {
      const uri = "data/get-product-detail";
      let message = {
        productId: cart[i].productId,
      };
      this._dataService.post(uri, message).subscribe(
        (data: any) => {
          this.cartProtect[
            i
          ].product_price = data.data[0].product_price.toString();
          this.totalPriceOfAllProduct +=
            +data.data[0].product_price * cart[i].quantity;
          console.log(this.totalPriceOfAllProduct);
          this.cartInfo.totalPrice = this.totalPriceOfAllProduct;
          console.log(this.cartProtect);
        },
        (err: any) => {}
      );
    }
  }
  checkOut() {
    if (this.cartInfo.totalPrice == 0) {
      this.sharingData.ShareCart.subscribe((data) => {
        this.cartInfo.totalPrice = data;
      });
    }
    let uri = "cart/post-user-infor";
    console.log(this.cartInfo);

    this._dataService.post(uri, this.cartInfo).subscribe(
      (data: any) => {
        console.log(data);

        this.orderID = data.data[0].order_id;
        console.log(this.orderID);

        for (let i = 0; i < this.cartProtect.length; i++) {
          if (i == this.cartProtect.length - 1) {
            console.log("true");
            this.postOrderDetail(
              this.orderID,
              this.cartProtect[i].productId,
              this.cartProtect[i].quantity,
              this.cartProtect[i].product_price,
              this.cartProtect[i].productName,
              true
            );
          } else {
            console.log("false");
            this.postOrderDetail(
              this.orderID,
              this.cartProtect[i].productId,
              this.cartProtect[i].quantity,
              this.cartProtect[i].product_price,
              this.cartProtect[i].productName,
              false
            );
          }
        }
      },
      (err: any) => {}
    );
  }
  postOrderDetail(
    _orderId,
    _productID,
    _quantity,
    price,
    product_name,
    createPaymentFlag
  ) {
    let message = {
      orderId: _orderId,
      productId: _productID,
      productName: product_name,
      productPrice: price,
      quantity: _quantity,
    };
    let uri = "cart/post-order-detail";
    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        console.log(data);

        if (createPaymentFlag == true) {
          if (this.cartInfo.paymentMethod == "cash") {
            this.router.navigate([`/xu-ly-thanh-toan`], {
              queryParams: { cash: "true" },
            });
          } else {
            this.createPayment(_orderId);
          }
        }
      },
      (err: any) => {}
    );
  }
  createPayment(order_id) {
    Swal.fire({
      icon: "info",
      // title: "Successul",
      text: "Đang chuyển hướng đến trang thanh toán",
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      timer: 20000,
    });

    let uri = "payment/create-payment";
    let message = {
      orderId: order_id,
    };

    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        console.log(data);
        console.log(order_id);

        // this.router.navigate([`/chi-tiet`]);
        localStorage.setItem("orderid", JSON.stringify(order_id));
        // this.sharingData.sharingDataOrderID(order_id);
        window.open(data.href, "_self");
      },
      (err: any) => {
        console.log(err);

        console.log("error");
      }
    );
  }
}
