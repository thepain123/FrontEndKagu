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
    userId: 1,
    name: "string",
    phone: "string",
    email: "string",
    address: "string",
    deliveryOption: "Viet Nam Post",
    totalPrice: 0,
    discountCode: "string",
    firstPrice: 0,
    paymentMethod: "cash",
  };
  cartProtect: any;
  orderID: number;
  temp: any;
  discountCode: any;
  totalPriceOfAllProduct: number;
  totalPriceOfAllProductFormat: string;
  srcImage: any;
  constructor(
    private _dataService: DataService,
    private sharingData: SharingDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartProtect = JSON.parse(localStorage.getItem("cart"));
    this.totalPriceOfAllProductFormat = JSON.parse(
      sessionStorage.getItem("priceFormat")
    );

    this.calculateTotalPrice();
    this.srcImage = "../../../assets/article_1546001113_751.png";
    this.sharingData.ShareOrderInfo.subscribe((data) => {
      this.temp = data;
      this.cartInfo.name = this.temp.name;
      this.cartInfo.phone = this.temp.phone;
      this.cartInfo.email = this.temp.email;
      this.cartInfo.address = this.temp.address;
    });

    if (sessionStorage.getItem("userKagu")) {
      this.cartInfo.userId = JSON.parse(
        sessionStorage.getItem("userKagu")
      ).data.user.id;
    } else {
      this.cartInfo.userId = "";
    }

    console.log(this.cartInfo);
  }

  selectDeliveryOption(id) {
    switch (id) {
      case 1:
        this.cartInfo.deliveryOption = "Viet Nam Post";
        this.srcImage = "../../../assets/article_1546001113_751.png";
        break;
      case 2:
        this.cartInfo.deliveryOption = "GHN Express";
        this.srcImage =
          "../../../assets/ghn_express__logo_mau_tren_nen_trong_suot_b01a2d72f3c240c2967208db370508de.png";
        break;
      case 3:
        this.cartInfo.deliveryOption = "Viettel Post";
        this.srcImage = "../../../assets/1536138107_final_3.png";
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
    console.log("calculate");

    this.totalPriceOfAllProduct = 0;
    let cart = JSON.parse(localStorage.getItem("cart"));

    console.log(this.cartProtect);

    const uri = "data/get-product-detail";
    let message = {
      productId: 1,
    };
    for (let i = 0; i < cart.length; i++) {
      message = {
        productId: cart[i].productId,
      };
      this._dataService.post(uri, message).subscribe(
        (data: any) => {
          this.cartInfo.firstPrice +=
            +data.data[0].product_price * cart[i].quantity;
          if (i == cart.length - 1) {
            if (sessionStorage.getItem("discountCode")) {
              this.cartInfo.discountCode = JSON.parse(
                sessionStorage.getItem("discountCode")
              );
              let temp, convert: number;
              temp = this.totalPriceOfAllProduct;
              convert = temp.toLocaleString("de-DE");
              this.totalPriceOfAllProductFormat = convert.toString();
              this.enterDiscountCodeFunc(this.cartInfo.discountCode);
              console.log("discount");
            } else {
              this.cartInfo.discountCode = "";
            }
          }
        },
        (err: any) => {}
      );
    }
  }

  enterDiscountCodeFunc(code) {
    let uri = "data/check-discount-code";
    console.log(code);

    console.log(code);
    console.log(this.totalPriceOfAllProduct);

    let message = {
      discountCode: code,
      totalMoney: this.cartInfo.firstPrice.toString(),
    };
    console.log(this.totalPriceOfAllProduct);

    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        console.log(data);

        this.cartInfo.totalPrice = data.data.lastMoney;
        this.totalPriceOfAllProductFormat = data.data.lastMoneyFormat;
      },
      (err: any) => {
        console.log(err);

        console.log("error");
      }
    );
  }

  checkOut() {
    if (this.cartInfo.totalPrice == 0) {
      this.cartInfo.totalPrice = this.cartInfo.firstPrice;
    }
    let uri = "cart/post-user-infor";
    console.log(this.cartInfo);
    console.log(this.cartProtect);

    this._dataService.post(uri, this.cartInfo).subscribe(
      (data: any) => {
        this.orderID = data.data[0].order_id;

        for (let i = 0; i < this.cartProtect.length; i++) {
          if (i == this.cartProtect.length - 1) {
            console.log("true");
            this.postOrderDetail(
              this.orderID,
              this.cartProtect[i].productId,
              this.cartProtect[i].quantity,
              this.cartProtect[i].priceNum,
              this.cartProtect[i].productName,
              true
            );
          } else {
            console.log("false");
            this.postOrderDetail(
              this.orderID,
              this.cartProtect[i].productId,
              this.cartProtect[i].quantity,
              this.cartProtect[i].priceNum,
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
        sessionStorage.setItem("orderid", JSON.stringify(order_id));
        // this.sharingData.sharingDataOrderID(order_id);
        window.open(data["0"], "_self");
      },
      (err: any) => {
        console.log(err);

        console.log("error");
      }
    );
  }
}
