import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Title, Meta } from "@angular/platform-browser";
import { SharingDataService } from "src/app/shared/sharing-data.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import * as Category from "../../category.json";
@Component({
  selector: "app-entities",
  templateUrl: "./entities.component.html",
  styleUrls: ["./entities.component.scss"],
})
export class EntitiesComponent implements OnInit {
  @ViewChild("formSignIn", { static: false }) formSignIn: NgForm;
  @ViewChild("loginRef", { static: true }) loginElement: ElementRef;
  @ViewChild("formSignUp", { static: false }) formSignUp: NgForm;

  auth2: any;
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
  ngOnInit() {
    this.showCart();
    this.showUser();
    this.getProductCategory();
    // this.googleSDK();
    this.fbLibrary();
  }

  ngDoCheck() {
    this.showCart();
  }
  showUser() {
    if (!localStorage.getItem("cart")) {
      let cart: any = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    if (sessionStorage.getItem("userKagu")) {
      this.loginCheck = true;
      this.user = JSON.parse(sessionStorage.getItem("userKagu"));
      this.usernameContent = `Chào ${this.user.data.user.name} !`;
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
    this.productCatList = Category.data;
    for (let i = 0; i < this.productCatList.length; i++) {
      this.productCatList[i] = {
        ...this.productCatList[i],
        routeLink: this.productCatRouteList[i],
      };
    }
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
    console.log("alolo");

    sessionStorage.removeItem("catid");
    sessionStorage.removeItem("url");

    sessionStorage.setItem("keyword", JSON.stringify(productByKeyword));
    this.sharingDataSerive.loadingFlag(11);
    this.router.navigate([`/tim-kiem`]);
  }
  searchButton() {
    sessionStorage.removeItem("catid");
    sessionStorage.removeItem("url");

    console.log("alolo");
    var keyword = (document.getElementById("inputSearch") as HTMLInputElement)
      .value;

    sessionStorage.setItem("keyword", JSON.stringify(keyword));
    this.sharingDataSerive.loadingFlag(10);
    this.router.navigate([`/tim-kiem`]);
  }
  loginKagu() {
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

        sessionStorage.setItem("userKagu", JSON.stringify(data));
        this.usernameContent = `Chào ${data.data.user.name} !`;
        location.reload();
      },
      (err: any) => {}
    );
  }

  loginAPIFG(email, name) {
    const uri = "auth/login-fg";
    let message = {
      email,
      name,
    };

    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        Swal.fire({
          icon: "success",
          title: "Successul",
          text: "Đăng nhập thành công",
          showConfirmButton: false,
          timer: 1500,
        });

        sessionStorage.setItem("userKagu", JSON.stringify(data));
        this.usernameContent = `Chào ${data.data.user.name} !`;
        location.reload();
      },
      (err: any) => {}
    );
  }

  logOut() {
    const uri = "auth/logout";

    this._dataService.post(uri).subscribe(
      (data: any) => {
        Swal.fire({
          icon: "success",
          title: "Successul",
          text: "Đăng xuất thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        location.reload();
        sessionStorage.removeItem("userKagu");
      },
      (err: any) => {}
    );
  }

  prepareLoginButton() {
    this.auth2.attachClickHandler(
      this.loginElement.nativeElement,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        //YOUR CODE HERE
        let email = profile.getEmail();
        let name = profile.getName();

        this.loginAPIFG(email, name);
      },
      (error) => {}
    );
  }
  googleSDK() {
    window["googleSDKLoaded"] = () => {
      window["gapi"].load("auth2", () => {
        this.auth2 = window["gapi"].auth2.init({
          client_id:
            "75566488133-b02ij6bai3ojooquosesiucngich2e81.apps.googleusercontent.com",
          cookiepolicy: "single_host_origin",
          scope: "profile email",
        });
        this.prepareLoginButton();
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "google-jssdk");
  }

  login() {
    window["FB"].login(
      (response) => {
        if (response.authResponse) {
          window["FB"].api(
            "/me",
            {
              fields: "last_name, first_name, email",
            },
            (userInfo) => {
              let name = `${userInfo.last_name} ${userInfo.first_name}`;
              let email = userInfo.email;
              this.loginAPIFG(email, name);
            }
          );
        } else {
        }
      },
      { scope: "email" }
    );
  }

  fbLibrary() {
    (window as any).fbAsyncInit = function () {
      window["FB"].init({
        appId: "297786728087689",
        cookie: true,
        xfbml: true,
        version: "v3.1",
      });
      window["FB"].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  _handleOnSubmitSignUp() {
    const uri = "auth/register";
    this._dataService.post(uri, this.formSignUp.value).subscribe(
      (data: any) => {
        Swal.fire({
          icon: "success",
          title: "Successul",
          text: "Đăng ký thành công",
          showConfirmButton: false,
          timer: 2500,
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
