
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Purchase } from 'src/app/Model/Purchase';
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

  constructor(
    private serv: VegitableServicesService,
    private sup: SupplierServiceService,
    private samana: PurchaseServicService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  supplierSearch: string = '';
  suppliersresponse: SupplierResponse[] = [];

  categories: Vegcategory[] = [];
  rowVegetables: Vegetable[][] = [];
  selectedCategoryIds: Array<number | null> = [];

  purchase: Purchase = {
    supplierId: 0,
    vehiclename: '',
    entryDateTime: '',
    truckWeight: 0,
    purchaseItems: []
  };

  totalAmount: number = 0;
  purchaseId: number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    // Categories load hone ke baad purchase load hoga.
    this.getCategory();
  }

  // ---------------- DATE ----------------

  private formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  // ---------------- CATEGORY ----------------

  getCategory(): void {
    this.serv.getallVegetablecategory().subscribe({
      next: (data: Vegcategory[]) => {
        this.categories = data ?? [];

        this.route.queryParamMap.subscribe(params => {
          const id = Number(params.get('id'));

          if (id > 0) {
            this.isEditMode = true;
            this.purchaseId = id;
            this.loadPurchaseById(id);
          } else {
            this.isEditMode = false;
            this.purchaseId = null;
            this.addItem();

            this.purchase.entryDateTime =
              this.formatDateTimeLocal(new Date());
          }
        });
      },
      error: error => {
        console.error('Category loading failed:', error);
        alert('Failed to load vegetable categories.');
      }
    });
  }

  // ---------------- SUPPLIER SEARCH ----------------

  searchSupplier(): void {
    const text = this.supplierSearch.trim();

    if (!text) {
      this.suppliersresponse = [];
      return;
    }

    this.sup.search(text).subscribe({
      next: data => {
        this.suppliersresponse = data ?? [];
      },
      error: error => {
        console.error('Supplier search failed:', error);
        this.suppliersresponse = [];
      }
    });
  }

  selectSupplier(supplier: SupplierResponse): void {
    this.purchase.supplierId = supplier.id;
    this.supplierSearch = supplier.name;
    this.suppliersresponse = [];
  }

  // ---------------- VEGETABLES ----------------

  getVegetablesByCategory(
    index: number,
    categoryId: number | null
  ): void {
    if (categoryId === null) {
      this.rowVegetables[index] = [];
      return;
    }

    this.serv.getvegetableByCartegory(categoryId).subscribe({
      next: (result: Vegetable[]) => {
        this.rowVegetables[index] = result ?? [];
      },
      error: error => {
        console.error('Vegetable API error:', error);
        this.rowVegetables[index] = [];
      }
    });
  }

  getVegetable(
    index: number,
    vegetableId: number | null
  ): Vegetable | null {
    if (vegetableId == null) {
      return null;
    }

    return this.rowVegetables[index]?.find(
      vegetable => vegetable.id === vegetableId
    ) ?? null;
  }

  onCategoryChange(index: number): void {
    const item = this.purchase.purchaseItems[index];

    if (!item) {
      return;
    }

    item.vegetableId = null;

    this.getVegetablesByCategory(
      index,
      this.selectedCategoryIds[index]
    );

    this.calculateTotal();
  }

  onVegetableChange(): void {
    this.calculateTotal();
  }

  // ---------------- PURCHASE ITEMS ----------------

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

    if (this.purchase.purchaseItems.length === 0) {
      this.addItem();
    }

    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.purchase.purchaseItems.reduce(
      (sum, item) =>
        sum + ((item.kg ?? 0) * (item.purchasePrice ?? 0)),
      0
    );
  }

  // ---------------- LOAD PURCHASE FOR EDIT ----------------

  loadPurchaseById(id: number): void {
    this.isLoading = true;

    this.samana.getpurchaseByid(id).subscribe({
      next: (response: any) => {
        console.log('Purchase response:', response);

        // Backend returns nested supplier and vegetable objects.
        this.purchase = {
          supplierId: response.supplier?.id ?? 0,
          vehiclename: response.vehiclename ?? '',
          entryDateTime: response.entryDateTime
            ?? (response.entryDate
              ? `${response.entryDate}T00:00`
              : ''),
          truckWeight: response.truckWeight ?? 0,

          purchaseItems: (response.purchaseItems ?? []).map(
            (item: any) => ({
              vegetableId: item.vegetable?.id ?? null,
              kg: item.kg ?? null,
              purchasePrice: item.purchasePrice ?? null
            })
          )
        };

        // Supplier name directly from backend response.
        this.supplierSearch = response.supplier?.name ?? '';
        this.suppliersresponse = [];

        // Initialize category and vegetable lists for every row.
        this.selectedCategoryIds =
          this.purchase.purchaseItems.map(() => null);

        this.rowVegetables =
          this.purchase.purchaseItems.map(() => []);

        this.totalAmount = response.netAmount ??
          this.purchase.purchaseItems.reduce(
            (sum, item) =>
              sum + ((item.kg ?? 0) * (item.purchasePrice ?? 0)),
            0
          );

        // Find each vegetable's category and load its dropdown.
        this.purchase.purchaseItems.forEach((item, index) => {
          this.loadVegetableForEdit(index, item.vegetableId);
        });

        this.isLoading = false;
      },
      error: error => {
        console.error('Purchase load failed:', error);
        this.isLoading = false;
        alert('Failed to load purchase. Please check the purchase ID.');
      }
    });
  }

  private loadVegetableForEdit(
    index: number,
    vegetableId: number | null
  ): void {
    if (vegetableId == null) {
      return;
    }

    this.categories.forEach(category => {
      this.serv.getvegetableByCartegory(category.id).subscribe({
        next: (vegetables: Vegetable[]) => {
          const list = vegetables ?? [];

          const found = list.some(
            vegetable => vegetable.id === vegetableId
          );

          if (found) {
            this.selectedCategoryIds[index] = category.id;
            this.rowVegetables[index] = list;
          }
        },
        error: error => {
          console.error('Could not load category vegetables:', error);
        }
      });
    });
  }

  // ---------------- RESET FORM ----------------

  resetForm(): void {
    this.purchase = {
      supplierId: 0,
      vehiclename: '',
      entryDateTime: this.formatDateTimeLocal(new Date()),
      truckWeight: 0,
      purchaseItems: []
    };

    this.supplierSearch = '';
    this.suppliersresponse = [];
    this.selectedCategoryIds = [];
    this.rowVegetables = [];
    this.totalAmount = 0;

    this.addItem();
  }

  // ---------------- SAVE NEW PURCHASE ----------------

  savePurchase(): void {
    if (this.isEditMode) {

    if (this.purchaseId === null) {
      alert('Purchase ID is missing.');
      return;
    }

    this.samana.editPurchase(
      this.purchaseId,
      this.purchase
    ).subscribe({
      next: (data: any) => {
        alert(data.message ?? 'Purchase updated successfully.');
      },
      error: (error) => {
        console.error('Update failed:', error);
        alert('Purchase update failed.');
      }
    });

    return;
  }

    if (!this.purchase.supplierId) {
      alert('Please select a supplier.');
      return;
    }

    if (!this.purchase.vehiclename?.trim()) {
      alert('Please enter vehicle name / number.');
      return;
    }

    const validItems = this.purchase.purchaseItems.filter(item =>
      item.vegetableId != null &&
      item.kg != null &&
      item.kg > 0 &&
      item.purchasePrice != null &&
      item.purchasePrice >= 0
    );

    if (validItems.length === 0) {
      alert('Please add at least one valid vegetable item.');
      return;
    }

    const payload: Purchase = {
      ...this.purchase,
      purchaseItems: validItems
    };

    this.samana.addPurchase(payload).subscribe({
      next: (data: any) => {
        alert(data.message ?? 'Purchase added successfully.');
        this.resetForm();
      },
      error: error => {
        console.error('Save purchase failed:', error);
        alert(
          error?.error?.message ??
          'Failed to save purchase.'
        );
      }
    });
  }
}
