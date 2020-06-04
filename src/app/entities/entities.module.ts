import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EntitiesRoutingModule } from "./entities-routing.module";
import { EntitiesComponent } from "./entities.component";
import { FormsModule } from "@angular/forms";
import { ProductDetailsComponent } from "./product-details/product-details.component";

@NgModule({
  declarations: [EntitiesComponent, ProductDetailsComponent],
  exports: [EntitiesComponent, ProductDetailsComponent],
  imports: [CommonModule, EntitiesRoutingModule, FormsModule],
})
export class EntitiesModule {}
