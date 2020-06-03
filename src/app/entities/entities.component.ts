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
  constructor(
    private _dataService: DataService,
    private sharingDataSerive: SharingDataService,
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {
    if (!localStorage.getItem("cart")) {
      let cart: any = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    if (localStorage.getItem("userKagu")) {
      this.loginCheck = true;
      this.user = JSON.parse(localStorage.getItem("user"));
      this.usernameContent = `Chào ${this.user.data.user.name} !`;
    } else {
      this.loginCheck = false;
    }
  }

  ngOnInit() {
    this.getProductCategory();
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
    this.sharingDataSerive.sharingDataCatID(catid);
    this.sharingDataSerive.sharingTypeLoad(1);
  }
  search(keyword) {
    console.log("search");
    this.sharingDataSerive.sharingDataKeyword(keyword);
    this.sharingDataSerive.sharingTypeLoad(2);

    this.router.navigate([`/tim-kiem`]);
  }
  searchButton() {
    var keyword = (document.getElementById("inputSearch") as HTMLInputElement)
      .value;

    console.log("searchButton");
    this.sharingDataSerive.sharingDataKeyword(keyword);
    this.sharingDataSerive.sharingTypeLoad(2);

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

        localStorage.setItem("user", JSON.stringify(data));
        this.usernameContent = `Chào ${data.data.user.name} !`;
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
