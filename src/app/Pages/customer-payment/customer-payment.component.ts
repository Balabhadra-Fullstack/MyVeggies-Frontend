
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerPayment } from 'src/app/Model/CustomerPayment';
import { CustomerPaymentResponse } from 'src/app/Model/CustomerPaymentResponse';
import { CustomerResponse } from 'src/app/Model/CustomerResponse';
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
    private saleService: SaleServiceService,
    private route: ActivatedRoute
  ) {}

  customer: CustomerResponse[] = [];

  customerSearch: string = '';

  isEdited: boolean = false;

  paymentId: number | null = null;

  filteredCustomers: CustomerResponse[] = [];

  showCustomerDropdown: boolean = false;

  // Customer ID maintained separately
  customerId: number | null = null;

  payment: CustomerPayment = {
    id: null,
    paymentamount: null,
    paymentmethod: '',
    paymenttime: ''
  };

  ngOnInit(): void {

    this.loadCustomers();

    this.loadpayment();

  }

  // Load all customers
  loadCustomers(): void {
    this.customerService.search('').subscribe({
      next: (data: CustomerResponse[]) => {
        this.customer = data;
      },
      error: (error: unknown) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  // Live customer search
  searchCustomer(): void {
    const search = this.customerSearch.trim().toLowerCase();
    this.customerId = null;
    this.showCustomerDropdown = true;

    if (!search) {
      this.filteredCustomers = [];
      return;
    }

    this.filteredCustomers = this.customer.filter(
      customer => customer.name?.toLowerCase().includes(search)
    );
  }

  // Select customer
  selectCustomer(customer: CustomerResponse): void {
    this.customerId = customer.id;
    this.customerSearch = customer.name;
    this.showCustomerDropdown = false;
    this.filteredCustomers = [];
  }

  // Save or update payment
  savePayment(): void {
    if (
      this.customerId === null ||
      this.payment.paymentamount === null ||
      !Number.isFinite(this.payment.paymentamount) ||
      this.payment.paymentamount <= 0 ||
      !this.payment.paymentmethod ||
      !this.payment.paymenttime ||
      (this.isEdited && this.paymentId === null)
    ) {
      Swal.fire('Warning', 'Please fill all payment details!', 'warning');
      return;
    }

    const request: CustomerPayment = {
      id: this.customerId,
      paymentamount: this.payment.paymentamount,
      paymentmethod: this.payment.paymentmethod,
      paymenttime: this.payment.paymenttime
    };

    if (this.isEdited) {
      this.saleService.editPayment(this.paymentId!, request).subscribe({
        next: response => {
          Swal.fire('Success', response.message || 'Payment updated successfully!', 'success');
          this.resetForm();
        },
        error: (error: any) => {
          console.error('Update error:', error);
          Swal.fire('Error', error.error?.message || 'Payment update failed!', 'error');
        }
      });
    } else {
      this.saleService.addpayment(request).subscribe({
        next: response => {
          Swal.fire('Success', response.message || 'Payment added successfully!', 'success');
          this.resetForm();
        },
        error: (error: any) => {
          console.error('Save error:', error);
          Swal.fire('Error', error.error?.message || 'Payment save failed!', 'error');
        }
      });
    }
  }

  // Load payment for editing
  loadpayment(): void {
    const paymentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return;
    }

    this.saleService.getpaymentByIdForEdit(paymentId).subscribe({
      next: (data: CustomerPaymentResponse) => {
        this.paymentId = data.paymentId;
        this.payment = {
          id: null,
          paymentamount: data.amount,
          paymentmethod: data.method,
          paymenttime: data.dateTime.slice(0, 10)
        };
        this.customerId = data.customerId;
        this.customerSearch = data.customerName;
        this.isEdited = true;
      },
      error: (error: unknown) => {
        console.error('Error loading payment:', error);
        Swal.fire('Error', 'Unable to load payment details!', 'error');
      }
    });
  }

  // Reset form
  resetForm(): void {
    this.payment = {
      id: null,
      paymentamount: null,
      paymentmethod: '',
      paymenttime: ''
    };

    this.paymentId = null;
    this.customerId = null;

    this.customerSearch = '';

    this.filteredCustomers = [];

    this.showCustomerDropdown = false;

    this.isEdited = false;
  }

  clearCustomerSearch(): void {
    this.customerSearch = '';
    this.customerId = null;
    this.filteredCustomers = [];
    this.showCustomerDropdown = false;
  }

}
