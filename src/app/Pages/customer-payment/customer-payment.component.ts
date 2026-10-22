
import { Component, OnInit } from '@angular/core';
import { CustomerPayment } from 'src/app/Model/CustomerPayment';
import { CustomerResponse } from 'src/app/Model/CustomerResponse';
import { SupplierResponse } from 'src/app/Model/SupplierResponse';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.css']
})
export class CustomerPaymentComponent implements OnInit {

  constructor(
    private customerService: CustomerServiceService,
    private saleService: SaleServiceService
  ) {}

  customer: CustomerResponse[] = [];

  customerSearch: string = '';

  filteredCustomers: CustomerResponse[] = [];

  showCustomerDropdown: boolean = false;

  payment: CustomerPayment = {
    id: null as number | null,
    paymentamount: null as number | null,
    paymentmethod: '',
    paymenttime: ''
  };

  ngOnInit(): void {

    this.loadCustomers();

  }

  // Load all customers
  loadCustomers(): void {

    this.customerService.search(this.customerSearch).subscribe({

      next: (data: any) => {

        this.customer = data;

      },

      error: (error: any) => {

        console.error('Error loading customers:', error);

      }

    });

  }

  // Search customer by name
  searchCustomer(): void {

    const search = this.customerSearch.trim().toLowerCase();

    // Clear previously selected customer when search changes
    this.payment.id = null;

    this.showCustomerDropdown = true;

    if (!search) {

      this.filteredCustomers = [];

      return;

    }

    this.filteredCustomers = this.customer.filter(
      (c: any) =>
        c.name &&
        c.name.toLowerCase().includes(search)
    );

  }

  // Select customer from search results
  selectCustomer(customer: any): void {

    this.payment.id = customer.id;

    this.customerSearch = customer.name;

    this.showCustomerDropdown = false;

    this.filteredCustomers = [];

  }

  // Save payment

savePayment(): void {
  this.saleService.addpayment(this.payment).subscribe({
    next: (response) => {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: response.message || 'Payment saved successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'payment-toast'
        }
      });

      this.payment = {
        id: null,
        paymentamount: null,
        paymentmethod: '',
        paymenttime: ''
      };
    },
    error: (error) => {
      console.error('Error saving payment:', error);

      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'error',
        title: error.error?.message || 'Failed to save payment!',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        customClass: {
          popup: 'payment-toast'
        }
      });
    }
  });
}
}