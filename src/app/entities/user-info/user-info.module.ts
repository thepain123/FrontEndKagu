import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserInfoRoutingModule } from "./user-info-routing.module";
import { UserInfoComponent } from "./user-info.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [UserInfoComponent],
  imports: [CommonModule, UserInfoRoutingModule, FormsModule],
})
export class UserInfoModule {}
