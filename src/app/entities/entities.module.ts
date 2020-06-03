import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EntitiesRoutingModule } from "./entities-routing.module";
import { EntitiesComponent } from "./entities.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [EntitiesComponent],
  exports: [EntitiesComponent],
  imports: [CommonModule, EntitiesRoutingModule, FormsModule],
})
export class EntitiesModule {}
