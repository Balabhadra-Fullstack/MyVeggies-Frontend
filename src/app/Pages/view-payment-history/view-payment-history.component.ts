import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerPaymentResponse } from 'src/app/Model/CustomerPaymentResponse';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';

@Component({
  selector: 'app-view-payment-history',
  templateUrl: './view-payment-history.component.html',
  styleUrls: ['./view-payment-history.component.css']
})
export class ViewPaymentHistoryComponent {
   paymentType: string = 'customer';

  searchText: string = '';

  filteredParties: any[] = [];

  selectedParty: any = null;

  fromDate: string = '';
  toDate: string = '';

  payments: CustomerPaymentResponse[] = [];

  currentPage: number = 0;
  pageSize: number = 30;

  totalPages: number = 0;
  totalElements: number = 0;

  pageTotal: number = 0;

  searched: boolean = false;
  loading: boolean = false;
  searchLoading: boolean = false;

  // Prevent an older search response from replacing newer results
  searchRequestId: number = 0;

  constructor(
    private purchaseService: PurchaseServicService,
    private saleService: SaleServiceService,
    private supplierService: SupplierServiceService,
    private customerService: CustomerServiceService,
    private route:Router
  ) { }


  // CHANGE CUSTOMER / SUPPLIER
  changePartyType(): void {

    this.searchRequestId++;

    this.searchText = '';
    this.filteredParties = [];
    this.selectedParty = null;

    this.payments = [];

    this.searched = false;

    this.currentPage = 0;
    this.totalPages = 0;
    this.totalElements = 0;
    this.pageTotal = 0;

  }


  // LIVE SEARCH
  searchParty(): void {

    this.selectedParty = null;

    const search = this.searchText.trim();

    this.filteredParties = [];

    const requestId = ++this.searchRequestId;

    if (search.length < 2) {
      this.searchLoading = false;
      return;
    }

    this.searchLoading = true;

    if (this.paymentType === 'customer') {

      this.customerService.search(search).subscribe({

        next: (res: any) => {

          if (requestId !== this.searchRequestId) {
            return;
          }

          this.filteredParties = Array.isArray(res) ? res : [];

          this.searchLoading = false;

        },

        error: (err) => {

          if (requestId !== this.searchRequestId) {
            return;
          }

          console.log('Customer search error:', err);

          this.filteredParties = [];
          this.searchLoading = false;

        }

      });

    } else {

      this.supplierService.search(search).subscribe({

        next: (res: any) => {

          if (requestId !== this.searchRequestId) {
            return;
          }

          this.filteredParties = Array.isArray(res) ? res : [];

          this.searchLoading = false;

        },

        error: (err) => {

          if (requestId !== this.searchRequestId) {
            return;
          }

          console.log('Supplier search error:', err);

          this.filteredParties = [];
          this.searchLoading = false;

        }

      });

    }

  }


  // SELECT CUSTOMER / SUPPLIER
  selectParty(party: any): void {

    this.searchRequestId++;

    this.selectedParty = party;

    this.searchText = party.name;

    this.filteredParties = [];

    this.searchLoading = false;

  }


  // CLEAR SEARCH
  clearSearch(): void {

    this.searchRequestId++;

    this.searchText = '';

    this.selectedParty = null;

    this.filteredParties = [];

    this.searchLoading = false;

  }


  // SUBMIT SEARCH
  submitSearch(): void {

    if (!this.selectedParty) {
      alert('Please select a customer or supplier.');
      return;
    }

    if (!this.fromDate || !this.toDate) {
      alert('Please select both dates.');
      return;
    }

    if (this.fromDate > this.toDate) {
      alert('Start date cannot be greater than end date.');
      return;
    }

    this.searched = true;

    this.currentPage = 0;

    this.loadPayments(0);

  }


  // LOAD PAYMENT HISTORY
  loadPayments(page: number): void {

    if (!this.selectedParty) {
      return;
    }

    const partyId = this.selectedParty.id;

    this.loading = true;

    this.payments = [];

    this.pageTotal = 0;

    if (this.paymentType === 'supplier') {

      this.purchaseService.getSupplierPaymentHistory(
        partyId,
        this.fromDate,
        this.toDate,
        page,
        this.pageSize

      ).subscribe({

        next: (res) => {

          this.setPaymentResponse(res);

        },

        error: (err) => {

          console.log('Supplier payment error:', err);

          alert('Unable to load supplier payment history.');

          this.loading = false;

        }

      });

    } else {

      this.saleService.getpaymentById(
        partyId,
        this.fromDate,
        this.toDate,
        page,
        this.pageSize

      ).subscribe({

        next: (res) => {

          this.setPaymentResponse(res);

        },

        error: (err) => {

          console.log('Customer payment error:', err);

          alert('Unable to load customer payment history.');

          this.loading = false;

        }

      });

    }

  }


  // COMMON PAGINATION RESPONSE
  setPaymentResponse(res: any): void {

    this.payments = res.content || [];

    this.currentPage = res.number;

    this.totalPages = res.totalPages;

    this.totalElements = res.totalElements;

    this.pageTotal = this.payments.reduce(
      (total: number, payment: any) => {
        return total + Number(payment.amount || 0);
      },
      0
    );

    this.loading = false;

  }


  // PREVIOUS PAGE
  previousPage(): void {

    if (this.currentPage > 0) {

      this.loadPayments(this.currentPage - 1);

    }

  }


  // NEXT PAGE
  nextPage(): void {

    if (this.currentPage < this.totalPages - 1) {

      this.loadPayments(this.currentPage + 1);

    }

  }


  // EDIT BUTTON - PAGE 0 ONLY
  editPayment(paymentId: number): void {

   if(this.paymentType=='customer'){
    this.route.navigate(['editcustomerpayment', paymentId]);
   }else{
    this.route.navigate(['editsupplierpayment', paymentId]);
   }

  }

}
