import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRoutingModule } from './exchange-routing.module';
import { ExchangeButtonComponent } from './exchange-button/exchange-button.component';


NgModule({
  declarations: [
    ExchangeButtonComponent,
  ],
  imports: [
    CommonModule,
    ExchangeRoutingModule,
  ]
})
export class ExchangeModule { }
