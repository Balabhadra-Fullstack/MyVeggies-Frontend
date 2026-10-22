import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  // =========================
  // REPORT TYPE
  // =========================

  reportType: string = 'supplier';

  supplierReportType: string = 'normal';


  // =========================
  // SEARCH
  // =========================

  partySearchText: string = '';

  filteredParties: any[] = [];

  suppliers: any[] = [
    {
      id: 1,
      name: 'Ramesh Supplier',
      mobileNumber: '9876543210'
    },
    {
      id: 2,
      name: 'Suresh Supplier',
      mobileNumber: '9876543211'
    }
  ];

  customers: any[] = [
    {
      id: 1,
      name: 'Mohan Customer',
      mobileNumber: '9876543222'
    },
    {
      id: 2,
      name: 'Raj Customer',
      mobileNumber: '9876543333'
    }
  ];


  // =========================
  // DATE
  // =========================

  fromDate: string = '';

  toDate: string = '';


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

  generateWordReport() {

    console.log('Generate Word Report');

    console.log({
      reportType: this.reportType,
      supplierReportType: this.supplierReportType,
      party: this.partySearchText,
      fromDate: this.fromDate,
      toDate: this.toDate
    });

  }


  // =========================
  // EXCEL
  // =========================

  exportExcel() {

    console.log('Export Excel');

  }

}