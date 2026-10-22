
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrateReturnRequest } from 'src/app/Model/CrateReturnRequest';
import { CustomerPaymentResponse } from 'src/app/Model/CustomerPaymentResponse';
import { SaleResponse } from 'src/app/Model/SaleResponse';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  // =====================================================
  // CUSTOMER
  // =====================================================

  selectedCustomer: any = null;

  currentDate = new Date();


  // =====================================================
  // SALES HISTORY
  // =====================================================

  sales: SaleResponse[] = [];

  // =====================================================
  // PAYMENT HISTORY
  // =====================================================

  payments: CustomerPaymentResponse[] = [];


  // =====================================================
  // CRATE RETURN FORM
  // =====================================================

  crateReturnQuantity: number = 0;

  crateReturnDate: string = this.getTodayDate();

  showCrateReturnModal: boolean = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private router: Router,
    private rout: ActivatedRoute,
    private customerServ: CustomerServiceService,
    private saleServ: SaleServiceService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    const id = this.rout.snapshot.paramMap.get('id');

    console.log('ID FROM URL:', id);

    if (!id) {

      console.log('Customer ID not found in URL');

      return;

    }


    const customerId = Number(id);

    console.log('Customer ID:', customerId);


    // ===================================================
    // CUSTOMER OBJECT FROM PREVIOUS COMPONENT
    // ===================================================

    const navigation = this.router.getCurrentNavigation();

    const stateCustomer =
      navigation?.extras?.state?.['customer']
      ?? history.state?.customer;


    this.selectedCustomer =
      this.normalizeCustomer(stateCustomer);


    // ===================================================
    // IF CUSTOMER OBJECT NOT AVAILABLE
    // FETCH CUSTOMER USING ID
    // ===================================================

    if (
      !this.selectedCustomer ||
      !this.selectedCustomer.name
    ) {

      this.customerServ.getByid(customerId).subscribe({
        next: (response) => {
          const result = Array.isArray(response) ? response[0] : response;
          this.selectedCustomer = this.normalizeCustomer(result);
        },
        error: (error) => {
          console.error('Error loading customer details:', error);
        }
      });

    }


    // ===================================================
    // SALES HISTORY
    // ===================================================

    this.getSaleHistory(customerId);


    // ===================================================
    // PAYMENT HISTORY
    // ===================================================

    this.getPaymentHistory(customerId);
    this.getCrateDetails(customerId);

    console.log(
      'Selected Customer:',
      this.selectedCustomer
    );

  }


  // =====================================================
  // NORMALIZE CUSTOMER
  // =====================================================

  private normalizeCustomer(customer: any): any {

    if (!customer) {

      return null;

    }


    return {

      ...customer,


      // =================================================
      // CUSTOMER ID
      // =================================================

      id:
        customer.id
        ?? customer.customerId
        ?? customer.CustomerId,


      // =================================================
      // CUSTOMER NAME
      // =================================================

      name:
        customer.name
        ?? customer.customerName
        ?? customer.Customername,


      // =================================================
      // MOBILE
      // =================================================

      mobileNumber:
        customer.mobileNumber
        ?? customer.mobile
        ?? customer.MobileNumber,


      // =================================================
      // TOTAL SALE
      // =================================================

      totalSale:
        customer.totalSale
        ?? customer.totalSales
        ?? customer.TotalSale
        ?? 0,


      // =================================================
      // TOTAL PAID
      // =================================================

      totalPaid:
        customer.totalPaid
        ?? customer.totalPaidAmount
        ?? customer.TotalPaid
        ?? 0,


      // =================================================
      // DUE AMOUNT
      // =================================================

      dueAmount:
        customer.dueAmount
        ?? customer.DueAmount
        ?? 0,


      // =================================================
      // CRATE DATA
      // =================================================
      // These values are coming from your repository.
      // No calculation is done here.

      crateTaken:
        customer.crateTaken
        ?? customer.totalCrateTaken
        ?? 0,


      crateReturned:
        customer.crateReturned
        ?? customer.totalCrateReturned
        ?? 0,


      crateDue:
        customer.crateDue
        ?? 0

    };

  }


  // =====================================================
  // SALES HISTORY
  // =====================================================

  getSaleHistory(customerId: number): void {
    this.saleServ.getLast3Sale(customerId).subscribe({
      next: (data) => {
        this.sales = data || [];
      },
      error: (error) => {
        console.error('Error loading sale history:', error);
        this.sales = [];
      }
    });

  }


  // =====================================================
  // PAYMENT HISTORY
  // =====================================================

  getPaymentHistory(customerId: number): void {
    this.saleServ.getLast3Payment(customerId).subscribe({
      next: (data) => {
        this.payments = data || [];
      },
      error: (error) => {
        console.error('Error loading payment history:', error);
        this.payments = [];
      }
    });

  }


  getCrateDetails(customerId: number): void {
    this.saleServ.getCrateDetails(customerId).subscribe({
      next: (response) => {
        const crate = Array.isArray(response) ? response[0] : response;

        if (!crate) {
          return;
        }

        this.selectedCustomer = {
          ...this.selectedCustomer,
          crateTaken: crate.CrateTaken ?? 0,
          crateReturned: crate.CrateReturned ?? 0,
          crateDue: crate.CrateDue ?? 0
        };
      },
      error: (error) => {
        console.error('Error loading crate details:', error);
      }
    });

  }


  // =====================================================
  // OPEN CRATE RETURN MODAL
  // =====================================================

  openCrateReturnModal(): void {

    if (!this.selectedCustomer) {

      alert('Customer not found');

      return;

    }


    if (this.selectedCustomer.crateDue <= 0) {

      alert('No crate is due from this customer');

      return;

    }


    // Reset form

    this.crateReturnQuantity = 0;

    this.crateReturnDate =
      this.getTodayDate();


    // Open modal

    this.showCrateReturnModal = true;

  }


  // =====================================================
  // CLOSE CRATE RETURN MODAL
  // =====================================================

  closeCrateReturnModal(): void {

    this.showCrateReturnModal = false;

  }


  // =====================================================
  // CREATE CRATE RETURN
  // =====================================================

  createCrateReturn(): void {

    // =================================================
    // CUSTOMER CHECK
    // =================================================

    if (!this.selectedCustomer) {

      alert('Customer not found');

      return;

    }


    // =================================================
    // CUSTOMER ID CHECK
    // =================================================

    if (!this.selectedCustomer.id) {

      alert('Customer ID not found');

      return;

    }


    // =================================================
    // QUANTITY CHECK
    // =================================================

    if (
      !this.crateReturnQuantity ||
      this.crateReturnQuantity <= 0
    ) {

      alert('Please enter crate quantity');

      return;

    }


    // =================================================
    // DUE CHECK
    // =================================================

    if (
      this.crateReturnQuantity >
      this.selectedCustomer.crateDue
    ) {

      alert(
        `Maximum ${this.selectedCustomer.crateDue} crates can be returned`
      );

      return;

    }


    // =================================================
    // DATE CHECK
    // =================================================

    if (!this.crateReturnDate) {

      alert('Please select return date');

      return;

    }


    // =================================================
    // REQUEST
    // =================================================

    const request:CrateReturnRequest = {

      customerId:
        this.selectedCustomer.id,

      quantity:
        this.crateReturnQuantity,

      returnDate:
        this.crateReturnDate

    };


    console.log(
      'Crate Return Request:',
      request
    );


    

      this.saleServ.returnCrate(request)
        .subscribe({

          next: (response) => {

            console.log(
              'Crate returned successfully:',
              response
            );

            this.closeCrateReturnModal();

            this.crateReturnQuantity = 0;

            this.crateReturnDate =
              this.getTodayDate();
            // IMPORTANT:
            // Backend save hone ke baad customer
            // summary dobara fetch karna hai.
            //
            // Backend/repository hi calculate karega:
            //
            // crateTaken
            // crateReturned
            // crateDue
            const customerId = this.selectedCustomer.id;
              this.getCrateDetails(customerId);
          },

          error: (error) => {

            console.error(
              'Error creating crate return:',
              error
            );

            alert(
              'Failed to return crate'
            );

          }

        });


  }


  // =====================================================
  // TODAY DATE
  // =====================================================

  private getTodayDate(): string {

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        today.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // =====================================================
  // WHATSAPP
  // =====================================================

  openWhatsApp(): void {

    if (!this.selectedCustomer) {

      alert('Customer not found');

      return;

    }


    if (!this.selectedCustomer.mobileNumber) {

      alert(
        'Customer mobile number not available'
      );

      return;

    }


    let mobile =
      String(this.selectedCustomer.mobileNumber);


    // =================================================
    // INDIA NUMBER
    // =================================================

    if (mobile.length === 10) {

      mobile = '91' + mobile;

    }


    // =================================================
    // LAST SALE
    // =================================================

    let lastSaleMessage = '';


    if (
      this.sales &&
      this.sales.length > 0
    ) {

      const lastSale = this.sales[0];


      if (
        lastSale.saleItems &&
        lastSale.saleItems.length > 0
      ) {

        const items =
          lastSale.saleItems
            .map(
              (item: any) =>
                `${item.vegetableName} - ` +
                `${item.kg} kg @ ` +
                `₹${item.salePrice}/kg`
            )
            .join('\n');


        lastSaleMessage =
          `Last Sold Items:\n${items}\n` +
          `Total Amount: ₹${lastSale.totalsaleAmount}\n`;

      }

    }


    // =================================================
    // WHATSAPP MESSAGE
    // =================================================

    const message =

      `Hello ${this.selectedCustomer.name},\n\n` +

      `${this.currentDate}\n\n` +

      `Your account summary:\n\n` +

      `${lastSaleMessage}` +

      `Now Due Amount is: ` +
      `₹${this.selectedCustomer.dueAmount}\n` +

      `---------------------------------------\n` +

      `TOTAL RECORD:\n` +

      `Total Sale: ` +
      `₹${this.selectedCustomer.totalSale}\n` +

      `Total Paid: ` +
      `₹${this.selectedCustomer.totalPaid}\n` +

      `Crate Taken: ` +
      `${this.selectedCustomer.crateTaken}\n` +

      `Crate Returned: ` +
      `${this.selectedCustomer.crateReturned}\n` +

      `Crate Due: ` +
      `${this.selectedCustomer.crateDue}\n\n` +

      `Thank you.`;


    const whatsappUrl =
      `https://wa.me/${mobile}` +
      `?text=${encodeURIComponent(message)}`;


    window.open(
      whatsappUrl,
      '_blank'
    );

  }


  // =====================================================
  // PRINT
  // =====================================================

  printStatement(): void {

    window.print();

  }

}