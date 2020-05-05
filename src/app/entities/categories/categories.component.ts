import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  constructor(
    private _dataService: DataService,
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {}
  newProductList: any = [];
  topProductList: any = [];
  slideShowList: any = [];
  ngOnInit() {
    this.title.setTitle("Chi tiết sản phẩm");
    this.meta.updateTag({
      name: "description",
      content: "Mô tả chi tiết bàn ghế sofa",
    });
    this.getSlideShow();
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
        this.getNewProducts();
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
