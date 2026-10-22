import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { SearchCustomer } from 'src/app/Model/SearchCustomer';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';

@Component({
  selector: 'app-exist-customer',
  templateUrl: './exist-customer.component.html',
  styleUrls: ['./exist-customer.component.css']
})
export class ExistCustomerComponent {

  searchText: string = '';

  customers: any[] = [];

  constructor(
    private router: Router,
    @Inject(CustomerServiceService)
    private customerService: CustomerServiceService
  ) {}

  goBack(): void {
    this.router.navigate(['/Customers']);
  }

  searchCustomer(): void {

    const text = this.searchText.trim();

    this.customerService.searchCustomer(text).subscribe({

      next: (data: any[]) => {

        console.log('Customer API Response:', data);

        this.customers = data.map(customer =>
          this.normalizeCustomer(customer)
        );

        console.log('Normalized Customers:', this.customers);
      },

      error: (error) => {

        console.error('Error searching customers:', error);

        this.customers = [];
      }

    });
  }


  private normalizeCustomer(customer: any): any {

    return {

      // =========================
      // CUSTOMER ID
      // =========================
      id:
        customer.id ??
        customer.customerId ??
        customer.CustomerId,


      // =========================
      // CUSTOMER NAME
      // =========================
      name:
        customer.name ??
        customer.customerName ??
        customer.CustomerName ??
        customer.Customername ??
        '',


      // =========================
      // MOBILE NUMBER
      // =========================
      mobileNumber:
        customer.mobileNumber ??
        customer.mobile ??
        customer.MobileNumber ??
        '',


      // =========================
      // TOTAL SALE
      // =========================
      totalSale:
        customer.totalSale ??
        customer.totalSales ??
        customer.totalAmountSold ??
        customer.TotalSale ??
        customer.TotalAmountSold ??
        0,


      // =========================
      // TOTAL PAID
      // =========================
      totalPaid:
        customer.totalPaid ??
        customer.totalPaidAmount ??
        customer.totalAmountPaidByCustomer ??
        customer.TotalPaid ??
        customer.TotalAmountPaid ??
        0,


      // =========================
      // DUE
      // =========================
      dueAmount:
        customer.dueAmount ??
        customer.DueAmount ??
        0

    };
  }


  openCustomer(customer: any): void {

    console.log('Selected Customer:', customer);

    this.router.navigate(
      ['/customer-details', customer.id],
      {
        state: {
          customer: customer
        }
      }
    );
  }

}