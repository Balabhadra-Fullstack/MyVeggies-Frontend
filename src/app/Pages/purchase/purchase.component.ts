import { Component, OnInit } from '@angular/core';
import { Purchase } from 'src/app/Model/Purchase';
import { PurchaseItems } from 'src/app/Model/PurchaseItems';
import { SupplierResponse } from 'src/app/Model/SupplierResponse';
import { Vegcategory } from 'src/app/Model/Vegcategory';
import { Vegetable } from 'src/app/Model/Vegetable';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';
import { VegitableServicesService } from 'src/app/Service/vegitable_ Category_ Services/vegitable-services.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
selectSupplier(supplier:SupplierResponse) {
this.purchase.supplierId=supplier.id;
this.supplierSearch=supplier.name;
this.suppliersresponse=[];
}
searchSupplier() {
  const text = this.supplierSearch.trim();

  if (!text) {
    this.suppliersresponse = [];
    return;
  }

  this.sup.search(text).subscribe(data=>{
      this.suppliersresponse=data;
    });
}
  
  constructor(private serv: VegitableServicesService,private sup:SupplierServiceService,private samana:PurchaseServicService) {}
  supplierSearch:String='';
  suppliersresponse: SupplierResponse[]=[];
  categories: Vegcategory[] = [ ];

  rowVegetables: Vegetable[][] = [];
  selectedCategoryIds: Array<number | null> = [];

  purchase:Purchase= {
    supplierId: 0,
    vehiclename: '',
    entryDateTime: '',
    truckWeight: 0,
    purchaseItems:[]
  };
  

  totalAmount: number = 0;

  ngOnInit(): void {
    this.getCategory();
    this.addItem();
    this.purchase.entryDateTime = this.formatDateTimeLocal(new Date());
    this.searchSupplier();
  }
  
 public getCategory(){
  this.serv.getallVegetablecategory().subscribe(data=>{
    
    this.categories=data;
  })
 }

  private formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

 public getVegetablesByCategory(index: number, categoryId: number | null): void {

  if (categoryId === null) {
    this.rowVegetables[index] = [];
    return;
  }

  this.serv.getvegetableByCartegory(categoryId).subscribe({
    next: (result) => {
      console.log('Vegetables:', result);
      this.rowVegetables[index] = result;
    },
    error: (error) => {
      console.error('Vegetable API Error:', error);
      this.rowVegetables[index] = [];
    }
  });
}

  /** Get full vegetable object by id (for showing image + name) */
  getVegetable(index: number, vegetableId: number | null): Vegetable | null {
    if (!vegetableId) return null;
    return this.rowVegetables[index]?.find(v => v.id === vegetableId) || null;
  }

  /** Get category object */
 

 onCategoryChange(index: number): void {
  const item = this.purchase.purchaseItems[index];
  item.vegetableId = null;

  this.getVegetablesByCategory(index, this.selectedCategoryIds[index]);

  this.calculateTotal();
}

  onVegetableChange(): void {
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.purchase.purchaseItems.reduce((sum, item) => {
      const qty = item.kg || 0;
      const price = item.purchasePrice || 0;
      return sum + (qty * price);
    }, 0);
  }

  addItem(): void {
    this.purchase.purchaseItems.push({
      vegetableId: null,
      kg: null,
      purchasePrice: null
    });
    this.selectedCategoryIds.push(null);
    this.rowVegetables.push([]);
  }

  removeItem(index: number): void {
    this.purchase.purchaseItems.splice(index, 1);
    this.selectedCategoryIds.splice(index, 1);
    this.rowVegetables.splice(index, 1);
    this.calculateTotal();
    if (this.purchase.purchaseItems.length === 0) {
      this.addItem();
    }
  }

  resetForm(): void {
    this.purchase = {
      supplierId: null,
      vehiclename: '',
      entryDateTime: this.formatDateTimeLocal(new Date()),
      truckWeight: null,
      purchaseItems: []
    };
    this.selectedCategoryIds = [];
    this.rowVegetables = [];
    this.totalAmount = 0;
    this.addItem();
  }

  savePurchase(): void {
    if (!this.purchase.supplierId) {
      alert('Please select a Supplier');
      return;
    }

    if (!this.purchase.vehiclename?.trim()) {
      alert('Please enter Vehicle Name / Number');
      return;
    }

    const hasValidItem = this.purchase.purchaseItems.some(item =>
      item.vegetableId && item.kg && item.purchasePrice
    );

    if (!hasValidItem) {
      alert('Please add at least one valid vegetable item');
      return;
    }
    this.samana.addPurchase(this.purchase).subscribe({
      next:(data:any)=>{
        alert(data.message)
      },
      error:(error)=>{
        alert(error)
      }
  })
         this. purchase= {
    supplierId: 0,
    vehiclename: '',
    entryDateTime: '',
    truckWeight: 0,
    purchaseItems:[]
  };
  this.supplierSearch='';
    
 
  }

}