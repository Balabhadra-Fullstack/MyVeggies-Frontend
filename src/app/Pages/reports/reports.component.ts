import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerResponse } from 'src/app/Model/CustomerResponse';
import { SupplierResponse } from 'src/app/Model/SupplierResponse';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { ExcelReportService } from 'src/app/Service/excel-report.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  constructor(private sup:SupplierServiceService,private cus:CustomerServiceService,private rout:Router,private excelReportService: ExcelReportService){}
  ngOnInit(){
this.result();
  }

  // =========================
  // REPORT TYPE
  // =========================

  reportType: string = 'supplier';

  supplierReportType: string = 'normal';
   partyId:number=0;

  // =========================
  // SEARCH
  // =========================

  partySearchText: string = '';

  filteredParties: any[] = [];

  suppliers:SupplierResponse[] = [];

  customers:CustomerResponse[] = [];


  // =========================
  // DATE
  // =========================

  fromDate: string = '';

  toDate: string = '';
selectedParty: any = null;

  // =========================
  // SELECT REPORT TYPE
  // =========================

  selectReportType(type: string) {

    this.reportType = type;

    this.partySearchText = '';

    this.filteredParties = [];

  }


  // =========================
  // SEARCH PARTY
  // =========================

  searchParty() {

    const text = this.partySearchText
      .toLowerCase()
      .trim();

    if (!text) {

      this.filteredParties = [];

      return;
    }


    const list =
      this.reportType === 'supplier'
        ? this.suppliers
        : this.customers;


    this.filteredParties = list.filter(party =>
      party.name
        .toLowerCase()
        .includes(text)
    );

  }


  // =========================
  // SELECT PARTY
  // =========================

  selectParty(party: any) {

    this.partySearchText = party.name;

    this.filteredParties = [];
    console.log('Selected Party:', party);
    this.selectedParty = party;

  }


  // =========================
  // RESET
  // =========================

  resetReport() {

    this.reportType = 'supplier';

    this.supplierReportType = 'normal';

    this.partySearchText = '';

    this.filteredParties = [];

    this.fromDate = '';

    this.toDate = '';

  }


  // =========================
  // WORD
  // =========================

  viewReport() {
      if (this.selectParty == null) {
    alert('Please select a supplier or customer from the search results.');
    return;
  }

  if (this.fromDate && this.toDate &&
      this.fromDate > this.toDate) {
    alert('From Date cannot be after To Date.');
    return;
  }
 const queryParams: any = {
    reportType: this.reportType,
    fromDate: this.fromDate || null,
    toDate: this.toDate || null,
    
  };
  if (this.reportType === 'supplier') {

    queryParams.supplierId = this.selectedParty.id;

    queryParams.supplierReportType = this.supplierReportType;

  } else {

    queryParams.customerId = this.selectedParty.id;

  }
this.rout.navigate(['/view'],{
    queryParams: queryParams
}
  );
  }
  
  // =========================
  // EXCEL
  // =========================

  exportToExcel() {
    if (this.selectParty == null) {
      alert('Please select a supplier or customer from the search results.');
      return;

    }
    this.excelReportService.exportExcel(
      this.reportType,
      this.supplierReportType,
      this.selectedParty.id,
      this.fromDate || '',
      this.toDate || ''
    ).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.reportType}_report.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, (error) => {
      console.error('Error exporting Excel:', error);
    });


  }
 result(){
     this.sup.search(this.partySearchText).subscribe(data=>{
      this.suppliers=data;
     });
this.cus.search(this.partySearchText).subscribe(customer=>{
  this.customers=customer;
});
  }
}
