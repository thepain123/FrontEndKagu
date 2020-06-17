import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// import { ProductDetailsComponent } from "./product-details/product-details.component";
import { EntitiesComponent } from "./entities.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./home/home.module#HomeModule",
    // canActivate: [AuthGuard]
  },
  // {
  //   path: "chi-tiet-1",
  //   component: ProductDetailsComponent,
  //   // canActivate: [AuthGuard]
  // },
  {
    path: "chi-tiet",
    loadChildren: "./product-detail/product-detail.module#ProductDetailModule",
    // canActivate: [AuthGuard]
  },

  // {
  //   // loadChildren: "./product-detail/product-detail.module#ProductDetailModule",
  //   // // canActivate: [AuthGuard]
  // },
  {
    path: "xu-ly-thanh-toan",

    loadChildren:
      "./execute-payment/execute-payment.module#ExecutePaymentModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "gio-hang",
    loadChildren: "./cart/cart.module#CartModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "thanh-toan",
    loadChildren: "./checkout/checkout.module#CheckoutModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "thong-tin-dat-hang",
    loadChildren: "./address/address.module#AddressModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "tai-khoan",
    loadChildren: "./user-info/user-info.module#UserInfoModule",
    // canActivate: [AuthGuard]
  },
  {
    path: ":categories",
    loadChildren: "./categories/categories.module#CategoriesModule",
    // canActivate: [AuthGuard]
  },
  {
    path: "tai-khoan",
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
