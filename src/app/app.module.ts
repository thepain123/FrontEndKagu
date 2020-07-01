import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EntitiesModule } from "./entities/entities.module";
// import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
// import {
//   LocationStrategy,
//   HashLocationStrategy,
//   PathLocationStrategy,
// } from "@angular/common";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, EntitiesModule, HttpClientModule],
  // providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
