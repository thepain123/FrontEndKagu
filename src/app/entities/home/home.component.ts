import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private _dataService: DataService, private router: Router) {}
  newProductList: any = [];
  topProductList: any = [];
  slideShowList: any = [];
  ngOnInit() {
    this.getSlideShow();
    this.getNewProducts();
  }
  getNewProducts() {
    const uri = "data/get-new-product";
    this._dataService.get(uri).subscribe(
      (data: any) => {
        this.newProductList = data.data;
        console.log(this.newProductList);
      },
      (err: any) => {}
    );
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
  getSlideShow() {
    const uri = "data/get-slide-show";
    this._dataService.get(uri).subscribe(
      (data: any) => {
        this.slideShowList = data.data;
        console.log(this.slideShowList);
        this.getTopProducts();
      },
      (err: any) => {}
    );
  }
}
