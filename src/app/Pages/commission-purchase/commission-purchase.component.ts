import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commission-purchase',
  templateUrl: './commission-purchase.component.html',
  styleUrls: ['./commission-purchase.component.css']
})
export class CommissionPurchaseComponent implements OnInit {

  // =========================
  // SUPPLIER
  // =========================

  suppliers: any[] = [];

  supplierSearch: string = '';

  filteredSuppliers: any[] = [];


  // =========================
  // VEGETABLES
  // =========================

  vegetables: any[] = [];


  // =========================
  // COMMISSION PURCHASE
  // =========================

  commissionPurchase: any = {

    supplierId: null,

    truckNumber: '',

    dateTime: '',

    commissionPercent: 8,

    truckCharge: 0,

    labourCharge: 0,

    otherCharge: 0,

    items: []

  };


  ngOnInit(): void {

    // Yahan tum apne existing API methods call karna
    // this.getSuppliers();
    // this.getVegetables();

  }


  // =========================
  // SUPPLIER LIVE SEARCH
  // =========================

  searchSupplier(): void {

    const search = this.supplierSearch
      .toLowerCase()
      .trim();

    if (!search) {

      this.filteredSuppliers = [];

      this.commissionPurchase.supplierId = null;

      return;
    }

    this.filteredSuppliers = this.suppliers.filter(
      supplier =>
        supplier.name
          .toLowerCase()
          .startsWith(search)
    );

  }


  // =========================
  // SELECT SUPPLIER
  // =========================

  selectSupplier(supplier: any): void {

    this.commissionPurchase.supplierId = supplier.id;

    this.supplierSearch = supplier.name;

    this.filteredSuppliers = [];

  }


  // =========================
  // ADD VEGETABLE
  // =========================

  addVegetable(): void {

    this.commissionPurchase.items.push({

      vegetableId: null,

      quantity: 0,

      sellingPrice: 0

    });

  }


  // =========================
  // REMOVE VEGETABLE
  // =========================

  removeVegetable(index: number): void {

    this.commissionPurchase.items.splice(index, 1);

  }


  // =========================
  // TOTAL SALE
  // =========================

  getTotalSale(): number {

    return this.commissionPurchase.items.reduce(
      (total: number, item: any) => {

        const quantity = Number(item.quantity) || 0;

        const price = Number(item.sellingPrice) || 0;

        return total + (quantity * price);

      },
      0
    );

  }


  // =========================
  // COMMISSION AMOUNT
  // =========================

  getCommissionAmount(): number {

    const totalSale = this.getTotalSale();

    const percent =
      Number(this.commissionPurchase.commissionPercent) || 0;

    return totalSale * percent / 100;

  }


  // =========================
  // SUPPLIER PAYABLE
  // =========================

  getSupplierPayable(): number {

    const totalSale = this.getTotalSale();

    const commission = this.getCommissionAmount();

    const truckCharge =
      Number(this.commissionPurchase.truckCharge) || 0;

    const labourCharge =
      Number(this.commissionPurchase.labourCharge) || 0;

    const otherCharge =
      Number(this.commissionPurchase.otherCharge) || 0;

    return (
      totalSale
      - commission
      - truckCharge
      - labourCharge
      - otherCharge
    );

  }


  // =========================
  // SAVE
  // =========================

  saveCommissionPurchase(): void {

    console.log(
      'Commission Purchase:',
      this.commissionPurchase
    );

  }

}