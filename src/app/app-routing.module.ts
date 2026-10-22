import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { SupplierComponent } from './Pages/supplier/supplier.component';
import { PurchaseComponent } from './Pages/purchase/purchase.component';
import { CustomersComponent } from './Pages/customers/customers.component';
import { SaleComponent } from './Pages/sale/sale.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { ExistSupplierComponent } from './Pages/exist-supplier/exist-supplier.component';
import { SupplierDetailsComponent } from './Pages/supplier-details/supplier-details.component';
import { EditPurchaseComponent } from './Pages/edit-purchase/edit-purchase.component';
import { SupplierPaymentComponent } from './Pages/supplier-payment/supplier-payment.component';
import { CustomerPaymentComponent } from './Pages/customer-payment/customer-payment.component';
import { CommissionPurchaseComponent } from './Pages/commission-purchase/commission-purchase.component';
import { EditSaleComponent } from './Pages/edit-sale/edit-sale.component';
import { CustomerDetailsComponent } from './Pages/customer-details/customer-details.component';
import { ExistCustomerComponent } from './Pages/exist-customer/exist-customer.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'Supplier', component: SupplierComponent },
      { path: 'Purchase', component: PurchaseComponent },
      { path: 'Customers', component: CustomersComponent },
      { path: 'Sale', component: SaleComponent },
      { path: 'reports', component: ReportsComponent },
      {path: 'exist-supplier',component:ExistSupplierComponent},
      {path: 'supplier-details/:id',component:SupplierDetailsComponent},
      {path:'editPurchase',component:EditPurchaseComponent},
      {path:'supplier-payment',component:SupplierPaymentComponent},
      {path:'customer-payment',component:CustomerPaymentComponent},
      {path:'commission',component:CommissionPurchaseComponent},
      {path:'editSale',component:EditSaleComponent},
      {path:'customer-details/:id',component:CustomerDetailsComponent},
      {path:'exist-customer',component:ExistCustomerComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
