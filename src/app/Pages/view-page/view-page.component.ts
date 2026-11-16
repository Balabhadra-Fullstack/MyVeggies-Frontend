import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PurchaseResponse } from 'src/app/Model/PurchaseResponse';
import { commissionResponse } from 'src/app/Model/commissionResponse';
import { SaleResponse } from 'src/app/Model/SaleResponse';


import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';
import { CommissionpurchaseService } from 'src/app/Service/commissionpurchase.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';
import { PageResponse } from 'src/app/Model/PageResponse';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private purchase: PurchaseServicService,
    private commission: CommissionpurchaseService,
    private sale: SaleServiceService
  ) {}

  ReportType: string = '';
  supplierReportType: string = '';

  supplierId: number = 0;
  customerId: number = 0;

  fromDate: string = '';
  toDate: string = '';

  supplierPurchase: PurchaseResponse[] = [];
  supplierCommissionPurchase: commissionResponse[] = [];
  customerSale: SaleResponse[] = [];

  currentPage: number = 0;
  pageSize: number = 30;
  totalPages: number = 0;
  totalElements: number = 0;

  loading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.ReportType =
      this.route.snapshot.queryParamMap.get('reportType') || '';

    this.supplierId = Number(
      this.route.snapshot.queryParamMap.get('supplierId')
    );

    this.customerId = Number(
      this.route.snapshot.queryParamMap.get('customerId')
    );

    this.supplierReportType =
      this.route.snapshot.queryParamMap.get('supplierReportType') || '';

    this.fromDate =
      this.route.snapshot.queryParamMap.get('fromDate') || '';

    this.toDate =
      this.route.snapshot.queryParamMap.get('toDate') || '';

    this.viewReport();
  }

  viewReport(): void {

    if (!this.fromDate || !this.toDate) {
      this.errorMessage = 'Please select both From Date and To Date.';
      return;
    }

    if (this.fromDate > this.toDate) {
      this.errorMessage = 'From Date cannot be after To Date.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    if (this.ReportType === 'supplier') {

      if (this.supplierId <= 0) {
        this.loading = false;
        this.errorMessage = 'Invalid Supplier ID.';
        return;
      }

      if (this.supplierReportType === 'normal') {
        this.loadNormalPurchases();
      }
      else if (this.supplierReportType === 'commission') {
        this.loadCommissionPurchases();
      }
      else {
        this.loading = false;
        this.errorMessage = 'Invalid supplier report type.';
      }

    }
    else if (this.ReportType === 'customer') {

      if (this.customerId <= 0) {
        this.loading = false;
        this.errorMessage = 'Invalid Customer ID.';
        return;
      }

      this.loadCustomerSales();

    }
    else {
      this.loading = false;
      this.errorMessage = 'Invalid Report Type.';
    }
  }

  loadNormalPurchases(): void {

    this.purchase.getPurchasesBetweenDates(
      this.supplierId,
      this.fromDate,
      this.toDate,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PageResponse<PurchaseResponse>) => {

        this.supplierPurchase = response.content;
        this.updatePagination(response);
        this.loading = false;

      },
      error: (error) => {
        console.error('Normal purchase report error:', error);
        this.loading = false;
        this.errorMessage = 'Unable to load purchase report.';
      }
    });
  }

  loadCommissionPurchases(): void {

    this.commission.getCommissionPurchasesBetweenDates(
      this.supplierId,
      this.fromDate,
      this.toDate,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PageResponse<commissionResponse>) => {

        this.supplierCommissionPurchase = response.content;
        this.updatePagination(response);
        this.loading = false;

      },
      error: (error) => {
        console.error('Commission purchase report error:', error);
        this.loading = false;
        this.errorMessage = 'Unable to load commission purchase report.';
      }
    });
  }

  loadCustomerSales():void {

    this.sale.getSalesBetweenDates(
      this.customerId,
      this.fromDate,
      this.toDate,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PageResponse<SaleResponse>) => {

        this.customerSale = response.content;
        this.updatePagination(response);
        this.loading = false;

      },
      error: (error) => {
        console.error('Customer sale report error:', error);
        this.loading = false;
        this.errorMessage = 'Unable to load customer sale report.';
      }
    });
  }

  updatePagination(response: PageResponse<any>): void {
    this.totalPages = response.totalPages;
    this.totalElements = response.totalElements;
    this.currentPage = response.number;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.viewReport();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.viewReport();
    }
  }

  

  printReport(): void {
    window.print();
  }

  get reportHeading(): string {

    if (this.ReportType === 'customer') {
      return 'Customer Sale Report';
    }

    if (this.supplierReportType === 'commission') {
      return 'Supplier Commission Purchase Report';
    }

    return 'Supplier Purchase Report';
  }
}