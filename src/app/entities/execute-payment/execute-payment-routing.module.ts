import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ExecutePaymentComponent } from "./execute-payment.component";

const routes: Routes = [
  {
    path: "",
    component: ExecutePaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutePaymentRoutingModule {}
