import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './Pages/layout/layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './Pages/sidebar/sidebar.component';
import { NavBarComponent } from './Component/NavBar/nav-bar/nav-bar.component';
import { SupplierComponent } from './Pages/supplier/supplier.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { PurchaseComponent } from './Pages/purchase/purchase.component';
import { CustomersComponent } from './Pages/customers/customers.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { ExistSupplierComponent } from './Pages/exist-supplier/exist-supplier.component';
import { SupplierDetailsComponent } from './Pages/supplier-details/supplier-details.component';
import { EditPurchaseComponent } from './Pages/edit-purchase/edit-purchase.component';
import { SupplierPaymentComponent } from './Pages/supplier-payment/supplier-payment.component';
import { CustomerPaymentComponent } from './Pages/customer-payment/customer-payment.component';
import { CommissionPurchaseComponent } from './Pages/commission-purchase/commission-purchase.component';
import { EditSaleComponent } from './Pages/edit-sale/edit-sale.component';
import { ExistCustomerComponent } from './Pages/exist-customer/exist-customer.component';
import { CustomerDetailsComponent } from './Pages/customer-details/customer-details.component';
import { SaleComponent } from './Pages/sale/sale.component';

@NgModule({
  declarations: [
    AppComponent,
     LoginComponent,
     LayoutComponent,
     SidebarComponent,
     NavBarComponent,
     SupplierComponent,
     DashboardComponent,
     PurchaseComponent,
     CustomersComponent,
     SaleComponent,
     ReportsComponent,
     ExistSupplierComponent,
     SupplierDetailsComponent,
     EditPurchaseComponent,
     SupplierPaymentComponent,
     CustomerPaymentComponent,
     CommissionPurchaseComponent,
     EditSaleComponent,
     ExistCustomerComponent,
     CustomerDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     FormsModule,
    HttpClientModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
