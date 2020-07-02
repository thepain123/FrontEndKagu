import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "src/app/shared/data.service";
import { SharingDataService } from "src/app/shared/sharing-data.service";

@Component({
  selector: "app-execute-payment",
  templateUrl: "./execute-payment.component.html",
  styleUrls: ["./execute-payment.component.scss"],
})
export class ExecutePaymentComponent implements OnInit {
  success: any;
  cash: any;
  PayerID: any;
  paymentId: any;
  successHTML: boolean = true;
  orderId: number;
  constructor(
    private activeatedRoute: ActivatedRoute,
    private _dataService: DataService,
    private sharingData: SharingDataService,
    private router: Router
  ) {}

  ngOnInit() {
    let cart: any = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.orderId = JSON.parse(localStorage.getItem("orderid"));
    console.log(this.orderId);

    this._getParamsFromURL();
  }
  _getParamsFromURL() {
    this.activeatedRoute.queryParams.subscribe((params: any) => {
      this.cash = params.cash;
    });
    if (this.cash == "true") {
      this.successHTML = true;
    } else {
      this.activeatedRoute.queryParams.subscribe((params: any) => {
        this.PayerID = params.PayerID;
      });
      this.activeatedRoute.queryParams.subscribe((params: any) => {
        this.paymentId = params.paymentId;
      });
      this.activeatedRoute.queryParams.subscribe((params: any) => {
        this.success = params.success;
        console.log(this.success);
        if (this.success == "true") {
          this.successHTML = true;
          console.log(this.orderId);

          this.executePayment(this.orderId, this.PayerID, this.paymentId);
        } else {
          this.successHTML = false;
        }
      });
    }
  }
  executePayment(orderID, PayerID, paymentId) {
    const uri = "payment/execute-payment";
    console.log(orderID);
    console.log(PayerID);
    console.log(paymentId);
    let message = {
      orderId: orderID,
      payerId: PayerID,
      paypalId: paymentId,
    };
    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        console.log(data);
      },
      (err: any) => {}
    );
  }
}
