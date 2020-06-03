import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AddressRoutingModule } from "./address-routing.module";
import { AddressComponent } from "./address.component";

@NgModule({
  declarations: [AddressComponent],
  imports: [CommonModule, AddressRoutingModule, FormsModule],
})
export class AddressModule {}
