import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Title, Meta } from "@angular/platform-browser";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
@Component({
  selector: "app-entities",
  templateUrl: "./entities.component.html",
  styleUrls: ["./entities.component.scss"],
})
export class EntitiesComponent implements OnInit {
  @ViewChild("formSignIn", { static: false }) formSignIn: NgForm;

  productCatList: any;
  loginCheck: any;
  user: any;
  productCatRouteList: any = ["giuong", "ban-ghe", "sofa", "tu-quan-ao", "ke"];
  usernameContent: string = "Đăng nhập";
  productQuantity: any;
  constructor(
    private _dataService: DataService,
    private sharingDataSerive: SharingDataService,
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {}
  ngOnChanges() {
    this.showUser();
  }
  ngOnInit() {
    this.showUser();
    this.getProductCategory();
    this.showCart();
  }
  ngDoCheck() {
    this.showCart();
  }
  showUser() {
    if (!localStorage.getItem("cart")) {
      let cart: any = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    if (localStorage.getItem("userKagu")) {
      this.loginCheck = true;
      console.log("loged");

      this.user = JSON.parse(localStorage.getItem("userKagu"));
      this.usernameContent = `Chào ${this.user.data.user.name} !`;
      console.log(this.usernameContent);
    } else {
      this.usernameContent = `Tài khoản`;
      this.loginCheck = false;
    }
  }
  showCart() {
    if (localStorage.getItem("cart")) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      this.productQuantity = cart.length;
    } else {
      this.productQuantity = 0;
    }
  }
  getProductCategory() {
    const uri = "data/get-product-category";

    this._dataService.get(uri).subscribe(
      (data: any) => {
        this.productCatList = data.data;
        console.log(this.productCatList);
        for (let i = 0; i < this.productCatList.length; i++) {
          this.productCatList[i] = {
            ...this.productCatList[i],
            routeLink: this.productCatRouteList[i],
          };
        }
      },
      (err: any) => {}
    );
  }
  selectCategory(catid) {
    let productByCat = {
      categoryId: catid,
      page: 1,
      sort: 0,
      rating: 0,
      minPrice: "0",
      maxPrice: "0",
    };
    sessionStorage.setItem("catid", JSON.stringify(productByCat));

    sessionStorage.removeItem("keyword");
    this.sharingDataSerive.loadingFlag(catid);
  }
  search(keyword) {
    let productByKeyword = {
      keyword: keyword,
      page: 1,
      sort: 0,
      rating: 0,
      minPrice: "0",
      maxPrice: "0",
    };
    sessionStorage.removeItem("catid");
    sessionStorage.setItem("keyword", JSON.stringify(productByKeyword));
    this.sharingDataSerive.loadingFlag(11);
    this.router.navigate([`/tim-kiem`]);
  }
  searchButton() {
    var keyword = (document.getElementById("inputSearch") as HTMLInputElement)
      .value;
    sessionStorage.removeItem("catid");
    sessionStorage.setItem("keyword", JSON.stringify(keyword));
    this.sharingDataSerive.loadingFlag(10);
    this.router.navigate([`/tim-kiem`]);
  }
  login() {
    const uri = "auth/login";
    if (this.formSignIn.valid) console.log(this.formSignIn.value);

    this._dataService.post(uri, this.formSignIn.value).subscribe(
      (data: any) => {
        Swal.fire({
          icon: "success",
          title: "Successul",
          text: "Đăng nhập thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log(data);

        localStorage.setItem("userKagu", JSON.stringify(data));
        this.usernameContent = `Chào ${data.data.user.name} !`;
        location.reload();
        console.log(this.usernameContent);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  logout() {
    const uri = "auth/login";
    if (this.formSignIn.valid) console.log(this.formSignIn.value);

    this._dataService.post(uri, this.formSignIn.value).subscribe(
      (data: any) => {
        Swal.fire({
          icon: "success",
          title: "Successul",
          text: "Đăng nhập thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log(data);

        localStorage.setItem("userKagu", JSON.stringify(data));
        this.usernameContent = `Chào ${data.data.user.name} !`;
        console.log(this.usernameContent);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
