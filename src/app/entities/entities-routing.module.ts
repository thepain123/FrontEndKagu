import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./home/home.module#HomeModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "product-detail",
    loadChildren: "./product-detail/product-detail.module#ProductDetailModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "cart",
    loadChildren: "./cart/cart.module#CartModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "checkout",
    loadChildren: "./checkout/checkout.module#CheckoutModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "shipping",
    loadChildren: "./address/address.module#AddressModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "categories",
    loadChildren: "./categories/categories.module#CategoriesModule",
    // canActivate: [AuthGuard]
  },
  // { path: "admin", loadChildren: "./admin/admin.module#AdminModule" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule {}
