import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutePaymentRoutingModule } from './execute-payment-routing.module';
import { ExecutePaymentComponent } from './execute-payment.component';


@NgModule({
  declarations: [ExecutePaymentComponent],
  imports: [
    CommonModule,
    ExecutePaymentRoutingModule
  ]
})
export class ExecutePaymentModule { }
