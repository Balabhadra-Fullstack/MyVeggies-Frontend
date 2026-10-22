import { Component, Inject, OnInit } from '@angular/core';
import { CustomerResponse } from 'src/app/Model/CustomerResponse';
import { Sale } from 'src/app/Model/Sale';
import { Vegcategory } from 'src/app/Model/Vegcategory';
import { Vegetable } from 'src/app/Model/Vegetable';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';
import { VegitableServicesService } from 'src/app/Service/vegitable_ Category_ Services/vegitable-services.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {



  constructor(
    private vegcat: VegitableServicesService,
    @Inject(CustomerServiceService) private customer: CustomerServiceService,
    @Inject(SaleServiceService) private saleService: SaleServiceService,
  ) {}

  // ===== DEMO SALE DATA =====

sale: Sale = {
  customerId: null,
  saleDate: '',
  crateCount: 0,
   saleItems:[]
};

customerSearchText: string = '';

customers: CustomerResponse[] = [];
categories: Vegcategory[] = [];

selectedCategoryIds: Array<number | null> = [];

rowVegetables: Vegetable[][] = [];

totalAmount: number = 0;

ngOnInit(): void {
  this.getCategory();
  this.addItem();
  this.sale.saleDate = this.formatDateTimeLocal(new Date());
}

getCategory(): void {
  this.vegcat.getallVegetablecategory().subscribe(data => {
    this.categories = data;
  });
}

private formatDateTimeLocal(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}


// ===== CUSTOMER SEARCH =====

searchCustomer() {

  const text = this.customerSearchText.trim();

  if (!text) {
    this.customers = [];
    return;
  }

  this.customer.search(text).subscribe(data => {
    this.customers = data;
  });
}


// ===== SELECT CUSTOMER =====

selectCustomer(customer: any) {

  this.sale.customerId = customer.id;
  this.customerSearchText = customer.name;

  this.customers = [];
}


// ===== ITEM =====

addItem() {

  this.sale.saleItems.push({
    vegetableId: null,
    kg: 0,
    salePrice: 0
  });

  this.selectedCategoryIds.push(null);
  this.rowVegetables.push([]);
}


removeItem(index: number) {

  this.sale.saleItems.splice(index, 1);
  this.selectedCategoryIds.splice(index, 1);
  this.rowVegetables.splice(index, 1);

  this.calculateTotal();
  if (this.sale.saleItems.length === 0) {
    this.addItem();
  }
}


// ===== CATEGORY =====

onCategoryChange(index: number) {
  this.sale.saleItems[index].vegetableId = null;
  const categoryId = this.selectedCategoryIds[index];

  if (categoryId === null) {
    this.rowVegetables[index] = [];
  } else {
    this.vegcat.getvegetableByCartegory(categoryId).subscribe({
      next: vegetables => this.rowVegetables[index] = vegetables,
      error: () => this.rowVegetables[index] = []
    });
  }

  this.calculateTotal();
}


// ===== VEGETABLE =====

onVegetableChange(): void {
  this.calculateTotal();
}


// ===== GET VEGETABLE =====

getVegetable(index: number, vegetableId: number | null): Vegetable | null {
  if (!vegetableId) return null;
  return this.rowVegetables[index]?.find(vegetable => vegetable.id === vegetableId) || null;
}


// ===== TOTAL =====

calculateTotal() {

  this.totalAmount = this.sale.saleItems.reduce(
    (total: number, item: any) =>
      total + ((item.kg || 0) * (item.salePrice || 0)),
    0
  );
}


// ===== BUTTON TEST =====

saveSale(): void {
  if (!this.sale.customerId) {
    alert('Please select a Customer');
    return;
  }

  const hasValidItem = this.sale.saleItems.some(item =>
    item.vegetableId && item.kg && item.salePrice
  );

  if (!hasValidItem) {
    alert('Please add at least one valid vegetable item');
    return;
  }

  this.saleService.addsale(this.sale).subscribe({
    next: () => {
      alert('Sale saved successfully');
      this.resetForm();
    },
    error: (err) => {
      console.error('Error saving sale:', err);
      alert('Failed to save sale. Please try again.');
    }
  });
}


resetForm() {

  this.sale = {
    customerId: null,
    saleDate: this.formatDateTimeLocal(new Date()),
    crateCount: null,
    saleItems: [
      {
        vegetableId: null,
        kg: 0,
        salePrice: 0
      }
    ]
  };

  this.customerSearchText = '';
  this.customers = [];
  this.selectedCategoryIds = [];
  this.rowVegetables = [];
  this.totalAmount = 0;
  this.addItem();
}

}
