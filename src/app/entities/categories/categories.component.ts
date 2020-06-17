import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { Subscription } from "rxjs";
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
    private meta: Meta,
    private sharingDataSerive: SharingDataService
  ) {}
  productList: any = [];
  cat_id: any;
  keyword: any;
  typeLoad: any;
  subcription: Subscription;
  typePage: any;
  message = {
    categoryId: 0,
    page: 0,
    sort: 0,
    rating: 0,
    minPrice: "0",
    maxPrice: "0",
  };
  messageSearch = {
    keyword: "",
    page: 0,
    sort: 0,
    rating: 0,
    minPrice: "0",
    maxPrice: "0",
  };
  totalPage: any = [];
  currentPage: any;

  ngOnInit() {
    this.title.setTitle("Danh mục sản phẩm");
    this.meta.updateTag({
      name: "description",
      content: "Tủ quần áo các loại",
    });
    this.detectTypeLoad();
  }
  nextPage(item) {
    switch (this.typePage) {
      case 1:
        this.messageSearch.page = item;
        this.getProductByKeyword(this.keyword);
        break;
      case 2:
        this.showProductByCategory(this.cat_id, item);
        break;
      case 3:
        break;

      default:
        break;
    }
  }
  detectTypeLoad() {
    this.sharingDataSerive.ShareTypeLoad.subscribe((data) => {
      console.log(data);
      this.typeLoad = data;
      switch (data) {
        case 1:
          this.detectProductCat();

          break;
        case 2:
          this.showSearchResult();

          break;
        default:
          this.showProductByCategory(1);
          break;
      }
    });
  }
  detectProductCat() {
    console.log("detect ");

    this.sharingDataSerive.ShareCatID.subscribe((data) => {
      this.cat_id = data;
      console.log(this.cat_id);
    });
    this.showProductByCategory(this.cat_id);
  }
  showSearchResult() {
    console.log("showsearch");
    this.typePage = 1;
    this.sharingDataSerive.ShareKeyword.subscribe((data) => {
      this.keyword = data;
      console.log("sub");
    });

    if (this.keyword !== "0") {
      this.getProductByKeyword(this.keyword);
    } else {
      this.showProductByCategory(1);
    }
  }
  getProductByKeyword(keyword) {
    console.log("api");
    const uri = "data/search-product";
    this.messageSearch.keyword = keyword;
    console.log(this.messageSearch);
    this._dataService.post(uri, this.messageSearch).subscribe(
      (data: any) => {
        this.productList = data.data.data;
        for (let i = 0; i < this.productList.length; i++) {
          let temp, convert: number;
          temp = +this.productList[i].product_price;
          convert = temp.toLocaleString("de-DE");
          this.productList[i].product_price = convert.toString();
        }
        let i = 0;
        this.totalPage = [];
        while (i <= data.data.numPage) {
          this.totalPage.push(i);
          i++;
        }

        console.log(this.productList);
      },
      (err: any) => {}
    );
  }
  showProductByCategory(
    cat_id,
    page = 0,
    sort = 0,
    rating = 0,
    minPrice = 0,
    maxPrice = 0
  ) {
    this.typePage = 2;
    this.currentPage = page;
    console.log(this.currentPage);

    const uri = "data/get-product-by-category-id";
    this.message = {
      categoryId: cat_id,
      page: page,
      sort: 0,
      rating: 0,
      minPrice: "0",
      maxPrice: "0",
    };
    this._dataService.post(uri, this.message).subscribe(
      (data: any) => {
        this.productList = data.data.data;
        for (let i = 0; i < this.productList.length; i++) {
          let temp, convert: number;
          temp = +this.productList[i].product_price;
          convert = temp.toLocaleString("de-DE");
          this.productList[i].product_price = convert.toString();
        }
        let i = 1;
        this.totalPage = [];
        while (i <= data.data.numPage) {
          this.totalPage.push(i);
          i++;
        }
      },
      (err: any) => {}
    );
  }
  selectSearch(rating) {
    if (this.keyword !== "0") {
      this.showProductSearchByRating(rating);
    } else {
      this.showProductByRating(rating);
    }
  }
  showProductByRating(rating) {
    this.typePage = 3;
    const uri = "data/get-product-by-category-id";
    this.message.rating = rating;
    this._dataService.post(uri, this.message).subscribe(
      (data: any) => {
        this.productList = data.data.data;
        for (let i = 0; i < this.productList.length; i++) {
          let temp, convert: number;
          temp = +this.productList[i].product_price;
          convert = temp.toLocaleString();
          console.log(convert);

          this.productList[i].product_price = convert.toString();
        }

        console.log(this.productList);
      },
      (err: any) => {}
    );
  }
  showProductSearchByRating(rating) {
    console.log(this.messageSearch);

    const uri = "data/search-product";
    this.messageSearch.rating = rating;

    this._dataService.post(uri, this.messageSearch).subscribe(
      (data: any) => {
        this.productList = data.data.data;
        for (let i = 0; i < this.productList.length; i++) {
          let temp, convert: number;
          temp = +this.productList[i].product_price;
          convert = temp.toLocaleString();
          console.log(convert);

          this.productList[i].product_price = convert.toString();
        }

        console.log(this.productList);
        return;
      },
      (err: any) => {}
    );
  }

  showProductDetail(product_id) {
    this.router.navigate([`/chi-tiet`], {
      queryParams: { maSP: product_id },
    });
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 400); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
  // ngOnDestroy() {
  //   this.subcription.unsubscribe();
  // }
}
