import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";
import * as NewProduct from '../../../new.json';
import * as BestSelling from '../../../selling.json';
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
  }
  ngAfterViewInit() {
    this.getTopProducts();
    if (window.innerWidth > 800) {
      this.getNewProducts();
    }
  }
  getNewProducts() {
    this.newProductList = NewProduct.data;
  }
  getTopProducts() {
    this.topProductList = BestSelling.data;
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
