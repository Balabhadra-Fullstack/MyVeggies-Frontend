import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerResponse } from 'src/app/Model/CustomerResponse';
import { SaleResponse } from 'src/app/Model/SaleResponse';
import { SaleResponseWithCrate } from 'src/app/Model/SaleResponseWithCrate';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})
export class EditSaleComponent {
  constructor(
    private customerService: CustomerServiceService,
    private saleService: SaleServiceService,
    private rout:Router
  ) {}

  customerSearch = '';
  filteredCustomers: CustomerResponse[] = [];
  selectedCustomer: CustomerResponse | null = null;
  sales: SaleResponseWithCrate[] = [];
  isLoading = false;
  errorMessage = '';

  searchCustomer(): void {
    this.selectedCustomer = null;
    this.sales = [];
    this.errorMessage = '';

    const name = this.customerSearch.trim();

    if (!name) {
      this.filteredCustomers = [];
      return;
    }

    this.customerService.search(name).subscribe({
      next: (customers) => {
        this.filteredCustomers = Array.isArray(customers) ? customers : [];
      },
      error: (error: unknown) => {
        console.error('Customer search failed:', error);
        this.filteredCustomers = [];
        this.errorMessage = 'Unable to search customers.';
      }
    });
  }

  selectCustomer(customer: CustomerResponse): void {
    this.selectedCustomer = customer;
    this.customerSearch = customer.name;
    this.filteredCustomers = [];
    this.loadSales();
  }

  private loadSales(): void {
    if (!this.selectedCustomer) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.sales = [];

    this.saleService.getLast30sale(this.selectedCustomer.id).subscribe({
      next: (sales) => {
        this.sales = Array.isArray(sales) ? sales : [];
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Unable to load sales:', error);
        this.errorMessage = 'Unable to load sales for this customer.';
        this.sales = [];
        this.isLoading = false;
      }
    });
  }
  edit(Id:number) {
      this.rout.navigate(['editsale', Id]);
}
}
