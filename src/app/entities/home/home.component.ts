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
    // this.getSlideShow();
  }
  ngAfterViewInit() {
    this.getTopProducts();
    if (window.innerWidth > 800) {
      this.getNewProducts();
    }
  }
  getNewProducts() {
    const uri = "data/get-new-product";
    this._dataService.get(uri).subscribe(
      (data: any) => {
        this.newProductList = data.data;
      },
      (err: any) => {}
    );
  }
  getTopProducts() {
    const uri = "data/get-best-selling-products";
    this._dataService.get(uri).subscribe(
      (data: any) => {
        this.topProductList = data.data;
      },
      (err: any) => {}
    );
  }
  getSlideShow() {
    const uri = "data/get-slide-show";
    this._dataService.get(uri).subscribe(
      (data: any) => {
        this.slideShowList = data.data;
        console.log(data.data);
      },
      (err: any) => {}
    );
  }
  showProductDetail(product_id) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 400); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
    this.router.navigate([`/chi-tiet`], {
      queryParams: { maSP: product_id },
    });
  }
}
