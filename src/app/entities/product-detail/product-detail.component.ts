import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  topProductList: any = [];
  constructor(private _dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.getTopProducts();
  }
  getTopProducts() {
    const uri = "data/get-best-selling-products";
    this._dataService.get(uri).subscribe(
      (data: any) => {
        this.topProductList = data.data;
        console.log(this.topProductList);
        // this.getNewProducts();
      },
      (err: any) => {}
    );
  }
}
