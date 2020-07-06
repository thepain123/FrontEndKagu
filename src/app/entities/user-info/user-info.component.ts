import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DataService } from "src/app/shared/data.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.scss"],
})
export class UserInfoComponent implements OnInit {
  @ViewChild("formUserInfo", { static: true }) formUserInfo: NgForm;
  constructor(private _dataService: DataService) {}
  user;
  ngOnInit() {
    this.showUser();
  }
  updateUserInfo() {
    console.log(this.formUserInfo.value);
    const uri = "user/edit-user-profile";
    let message = {
      name: this.formUserInfo.value.name,
      phone: this.formUserInfo.value.phone,
      address: this.formUserInfo.value.address,
    };

    this._dataService.put(uri, message).subscribe(
      (data: any) => {
        console.log(data);
        Swal.fire({
          icon: "success",
          title: "Successul",
          text: "Cập nhật thành công",
          showConfirmButton: false,
          timer: 1500,
        });

        // sessionStorage.setItem("userKagu", JSON.stringify(data));
        this.user.data.user.phone = data.data.phone;

        this.user.data.user.address = data.data.address;
        console.log(this.user.data.user.name);
        console.log(data.data.name);
        if (this.user.data.user.name !== data.data.name) {
          this.user.data.user.name = data.data.name;
          location.reload();
        }
        sessionStorage.setItem("userKagu", JSON.stringify(this.user));
        // location.reload();
        // sessionStorage.removeItem("userKagu");
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  showUser() {
    if (sessionStorage.getItem("userKagu")) {
      this.user = JSON.parse(sessionStorage.getItem("userKagu"));
      console.log(this.user.data.user.name);
      if (this.user.data.user.phone === null) {
        this.user.data.user.phone = "";
      }
      if (this.user.data.user.address === null) {
        this.user.data.user.address = "";
      }
      setTimeout(() => {
        this.formUserInfo.setValue({
          name: this.user.data.user.name,
          phone: this.user.data.user.phone,
          email: this.user.data.user.email,
          address: this.user.data.user.address,
        });
      });
    }
  }
}
