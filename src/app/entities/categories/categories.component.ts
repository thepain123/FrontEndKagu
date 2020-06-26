import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { min } from "rxjs/operators";
@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  @ViewChild("formCostRange", { static: false }) formCostRange: NgForm;

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
  firstTime: boolean = false;
  subcription: Subscription;
  typePage: any;
  loadCheck: boolean = false;
  message = {
    categoryId: 0,
    page: 1,
    sort: 0,
    rating: 0,
    minPrice: "0",
    maxPrice: "0",
  };
  messageSearch = {
    keyword: "",
    page: 1,
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
    this.firstLoad();
    this.reloadPage();
    // this.detectTypeLoad();
  }
  firstLoad() {
    if (this.firstTime === false) {
      console.log("first");

      this.sharingDataSerive.LoadHTML.subscribe((data) => {
        this.typeLoad = data;
        this.firstTime = true;
        this.loadHTML();
      });
    }
  }
  reloadPage() {
    this.sharingDataSerive.LoadHTML.subscribe((data) => {
      console.log(this.typeLoad);
      console.log(data);

      console.log("reload");
      if (this.typeLoad !== data) {
        this.typeLoad = data;
        this.loadHTML();
      }
    });
  }
  // ngOnDestroy() {
  //   sessionStorage.removeItem("catid");
  //   sessionStorage.removeItem("keyword");
  // }
  loadHTML() {
    if (sessionStorage.getItem("catid")) {
      this.message = JSON.parse(sessionStorage.getItem("catid"));
      this.showProductByCategory();
    } else {
      this.messageSearch = JSON.parse(sessionStorage.getItem("keyword"));
      this.getProductByKeyword(this.messageSearch.keyword);
    }
    this.loadCheck = true;
  }

  nextPage(item) {
    console.log(this.totalPage);
    if (sessionStorage.getItem("catid")) {
      this.message.page = item;
      this.cat_id = JSON.parse(sessionStorage.getItem("catid"));
      this.showProductByCategory();
    } else {
      this.keyword = JSON.parse(sessionStorage.getItem("keyword"));
      this.messageSearch.page = item;
      this.getProductByKeyword(this.keyword.keyword);
    }
  }

  getProductByKeyword(keyword) {
    console.log(this.totalPage);
    this.currentPage = this.messageSearch.page;

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
        let i = 1;
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
  selectCat(catId) {
    this.message = {
      categoryId: catId,
      page: 1,
      sort: 0,
      rating: 0,
      minPrice: "0",
      maxPrice: "0",
    };
    this.currentPage = this.message.page;

    sessionStorage.setItem("catid", JSON.stringify(this.message));
    sessionStorage.removeItem("keyword");

    const uri = "data/get-product-by-category-id";

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
  showProductByCategory(catId = 0) {
    this.currentPage = this.message.page;
    if (catId !== 0) {
      this.message.categoryId = catId;
    }
    sessionStorage.setItem("catid", JSON.stringify(this.message));
    sessionStorage.removeItem("keyword");

    const uri = "data/get-product-by-category-id";

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
  selectSearchFunc(rating) {
    if (sessionStorage.getItem("catid")) {
      // this.cat_id = JSON.parse(sessionStorage.getItem("catid"));
      this.showProductByRating(rating);
    } else {
      // this.keyword = JSON.parse(sessionStorage.getItem("keyword"));
      this.showProductSearchByRating(rating);
    }
  }
  selectCostRange() {
    console.log(this.formCostRange.value);
    let minPrice = this.formCostRange.value.minPrice;
    let maxPrice = this.formCostRange.value.maxPrice;
    if (minPrice <= 0 || minPrice == null) {
      minPrice = 0;
    }
    if (maxPrice <= 0 || maxPrice == null) {
      maxPrice = 0;
    }
    if (sessionStorage.getItem("catid")) {
      // this.cat_id = JSON.parse(sessionStorage.getItem("catid"));
      this.showProductByCostRange(minPrice, maxPrice);
    } else {
      // this.keyword = JSON.parse(sessionStorage.getItem("keyword"));
      this.showProductSearchByCostRange(minPrice, maxPrice);
    }
  }
  selectSortFunc(sort) {
    if (sessionStorage.getItem("catid")) {
      // this.cat_id = JSON.parse(sessionStorage.getItem("catid"));
      this.sortProductByCost(sort);
    } else {
      // this.keyword = JSON.parse(sessionStorage.getItem("keyword"));
      this.sortProductSearchByCost(sort);
    }
  }

  showProductByRating(rating) {
    console.log(this.totalPage);
    // this.typePage = 3;
    const uri = "data/get-product-by-category-id";
    this.message.rating = rating;
    this.message.page = 1;
    this.currentPage = this.messageSearch.page;

    sessionStorage.setItem("catid", JSON.stringify(this.message));

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
  showProductSearchByRating(rating) {
    const uri = "data/search-product";
    this.messageSearch.rating = rating;
    this.messageSearch.page = 1;
    this.currentPage = this.messageSearch.page;

    sessionStorage.setItem("keyword", JSON.stringify(this.messageSearch));

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

        let i = 1;
        this.totalPage = [];
        while (i <= data.data.numPage) {
          this.totalPage.push(i);
          i++;
        }
        return;
      },
      (err: any) => {}
    );
  }

  showProductByCostRange(minPrice, maxPrice) {
    console.log(this.totalPage);
    // this.typePage = 3;
    const uri = "data/get-product-by-category-id";
    this.message.minPrice = minPrice.toString();
    this.message.maxPrice = maxPrice.toString();
    this.message.page = 1;
    this.currentPage = this.messageSearch.page;

    sessionStorage.setItem("catid", JSON.stringify(this.message));

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
  showProductSearchByCostRange(minPrice, maxPrice) {
    const uri = "data/search-product";
    this.messageSearch.maxPrice = maxPrice.toString();
    this.messageSearch.minPrice = minPrice.toString();

    this.messageSearch.page = 1;
    this.currentPage = this.messageSearch.page;

    sessionStorage.setItem("keyword", JSON.stringify(this.messageSearch));

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

        let i = 1;
        this.totalPage = [];
        while (i <= data.data.numPage) {
          this.totalPage.push(i);
          i++;
        }
        return;
      },
      (err: any) => {}
    );
  }

  sortProductByCost(sort) {
    console.log(this.totalPage);
    // this.typePage = 3;
    const uri = "data/get-product-by-category-id";
    this.message.sort = sort;
    this.message.page = 1;
    this.currentPage = this.messageSearch.page;

    sessionStorage.setItem("catid", JSON.stringify(this.message));

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
  sortProductSearchByCost(sort) {
    const uri = "data/search-product";
    this.messageSearch.sort = sort;
    this.messageSearch.page = 1;
    this.currentPage = this.messageSearch.page;

    sessionStorage.setItem("keyword", JSON.stringify(this.messageSearch));

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

        let i = 1;
        this.totalPage = [];
        while (i <= data.data.numPage) {
          this.totalPage.push(i);
          i++;
        }
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
}
