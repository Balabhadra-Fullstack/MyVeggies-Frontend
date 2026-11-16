
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomerResponse } from 'src/app/Model/CustomerResponse';
import { Sale } from 'src/app/Model/Sale';
import { Vegcategory } from 'src/app/Model/Vegcategory';
import { Vegetable } from 'src/app/Model/Vegetable';

import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';
import { VegitableServicesService } from 'src/app/Service/vegitable_ Category_ Services/vegitable-services.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  isEdited: boolean = false;
  saleId: number | null = null;
  isLoading: boolean = false;

  sale: Sale = {
    customerId: null,
    saleDate: '',
    crateCount: null,
    saleItems: []
  };

  customerSearchText: string = '';
  customers: CustomerResponse[] = [];

  categories: Vegcategory[] = [];

  selectedCategoryIds: Array<number | null> = [];

  rowVegetables: Vegetable[][] = [];

  totalAmount: number = 0;

  constructor(
    private vegcat: VegitableServicesService,
    private customer: CustomerServiceService,
    private saleService: SaleServiceService,
    private rout: ActivatedRoute
  ) {}

  // =========================================
  // INITIALIZE
  // =========================================

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(): void {

    this.isLoading = true;

    this.vegcat.getallVegetablecategory().subscribe({

      next: (data: Vegcategory[]) => {

        this.categories = data || [];

        const id = Number(this.rout.snapshot.paramMap.get('id'));

        if (id > 0) {

          this.isEdited = true;
          this.saleId = id;

          this.loadSaleById(id);

        } else {

          this.isEdited = false;
          this.saleId = null;

          this.sale.saleDate = this.formatDateTimeLocal(new Date());

          this.addItem();

          this.isLoading = false;
        }

      },

      error: (error) => {

        console.error('Category loading failed:', error);

        this.isLoading = false;

        alert('Failed to load vegetable categories.');

      }

    });

  }

  // =========================================
  // DATE FORMAT
  // =========================================

  private formatDateTimeLocal(date: Date): string {

    const pad = (value: number) =>
      value.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

  }

  private toDateTimeLocal(value: any): string {

    if (!value) {
      return '';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value + 'T00:00';
    }

    return value.length >= 16 ? value.slice(0, 16) : value;

  }

  // =========================================
  // CUSTOMER SEARCH
  // =========================================

  searchCustomer(): void {

    const text = this.customerSearchText.trim();

    if (!text) {

      this.customers = [];

      return;
    }

    this.customer.search(text).subscribe({

      next: (data: CustomerResponse[]) => {

        this.customers = data || [];

      },

      error: (error) => {

        console.error('Customer search failed:', error);

        this.customers = [];

      }

    });

  }

  selectCustomer(customer: CustomerResponse): void {

    this.sale.customerId = customer.id;

    this.customerSearchText = customer.name;

    this.customers = [];

  }

  // =========================================
  // ADD ITEM
  // =========================================

  addItem(): void {

    this.sale.saleItems.push({

      vegetableId: null,
      kg: 0,
      salePrice: 0

    });

    this.selectedCategoryIds.push(null);

    this.rowVegetables.push([]);

  }

  // =========================================
  // REMOVE ITEM
  // =========================================

  removeItem(index: number): void {

    this.sale.saleItems.splice(index, 1);

    this.selectedCategoryIds.splice(index, 1);

    this.rowVegetables.splice(index, 1);

    if (this.sale.saleItems.length === 0) {

      this.addItem();

    }

    this.calculateTotal();

  }

  // =========================================
  // CATEGORY CHANGE
  // =========================================

  onCategoryChange(index: number): void {

    const item = this.sale.saleItems[index];

    if (!item) {
      return;
    }

    item.vegetableId = null;

    const categoryId = this.selectedCategoryIds[index];

    if (categoryId == null) {

      this.rowVegetables[index] = [];

      this.calculateTotal();

      return;
    }

    this.vegcat.getvegetableByCartegory(categoryId).subscribe({

      next: (vegetables: Vegetable[]) => {

        this.rowVegetables[index] = vegetables || [];

      },

      error: (error) => {

        console.error('Vegetable loading failed:', error);

        this.rowVegetables[index] = [];

      }

    });

    this.calculateTotal();

  }

  // =========================================
  // VEGETABLE CHANGE
  // =========================================

  onVegetableChange(): void {

    this.calculateTotal();

  }

  getVegetable(
    index: number,
    vegetableId: number | null
  ): Vegetable | null {

    if (vegetableId == null) {
      return null;
    }

    return this.rowVegetables[index].find(
      vegetable => vegetable.id === vegetableId
    ) || null;

  }

  // =========================================
  // CALCULATE TOTAL
  // =========================================

  calculateTotal(): void {

    this.totalAmount = this.sale.saleItems.reduce(

      (total: number, item: any) => {

        return total +
          ((Number(item.kg) || 0) *
          (Number(item.salePrice) || 0));

      },

      0

    );

  }

  // =========================================
  // GET SALE BY ID
  // =========================================

  private loadSaleById(id: number): void {

    this.isLoading = true;

    this.saleService.getSaleByIdWithCrate(id).subscribe({

      next: (response: any) => {

        console.log('GET SALE BY ID RESPONSE:', response);

        const saleData = response.data || response;

        // Backend SaleResponseWithCrate
        const items = saleData.saleItems || [];

        this.sale = {

          customerId: saleData.customerId != null
            ? Number(saleData.customerId)
            : null,

          saleDate: this.toDateTimeLocal(saleData.saleDate),

          crateCount: saleData.crateCount != null
            ? Number(saleData.crateCount)
            : null,

          saleItems: items.map((item: any) => ({

            vegetableId: item.vegetableId != null
              ? Number(item.vegetableId)
              : null,

            kg: Number(item.kg) || 0,

            salePrice: Number(item.salePrice) || 0

          }))

        };

        // Customer name
        this.customerSearchText = saleData.customername || '';

        this.customers = [];

        // Total sale amount
        this.totalAmount = Number(saleData.totalsaleAmount) || 0;

        // Load existing categories and vegetables
        this.loadExistingVegetables(items);

      },

      error: (error) => {

        console.error('Sale load failed:', error);

        this.isLoading = false;

        alert('Failed to load sale. Please check the sale ID.');

      }

    });

  }

  // =========================================
  // LOAD EXISTING VEGETABLES AND CATEGORIES
  // =========================================

  private loadExistingVegetables(items: any[]): void {

    if (items.length === 0) {

      this.sale.saleItems = [];

      this.selectedCategoryIds = [];

      this.rowVegetables = [];

      this.addItem();

      this.calculateTotal();

      this.isLoading = false;

      return;
    }

    // Load vegetables from every category
    const requests = this.categories.map(category => {

      return this.vegcat.getvegetableByCartegory(category.id).pipe(

        catchError(error => {

          console.error(
            'Category vegetable loading failed:',
            category.id,
            error
          );

          return of([]);

        })

      );

    });

    forkJoin(requests).subscribe({

      next: (categoryVegetables: Vegetable[][]) => {

        this.selectedCategoryIds = this.sale.saleItems.map(() => null);

        this.rowVegetables = this.sale.saleItems.map(() => []);

        // Match existing sale items with categories
        this.sale.saleItems.forEach((saleItem, index) => {

          const rawItem = items[index];

          const vegetableId = saleItem.vegetableId;

          const vegetableName = rawItem.vegetableName || '';

          // Search through all categories
          for (let i = 0; i < this.categories.length; i++) {

            const vegetables = categoryVegetables[i] || [];

            const foundVegetable = vegetables.find(v => {

              // Match using vegetable ID
              if (vegetableId != null) {

                return Number(v.id) === Number(vegetableId);

              }

              // Fallback using vegetable name
              return [

                v.name,
                v.odianame

              ].some(name =>

                name &&
                name.trim().toLowerCase() ===
                vegetableName.trim().toLowerCase()

              );

            });

            if (foundVegetable) {

              // Select original category
              this.selectedCategoryIds[index] =
                this.categories[i].id;

              // Load category vegetables
              this.rowVegetables[index] = vegetables;

              // Set selected vegetable
              saleItem.vegetableId = foundVegetable.id;

              break;

            }

          }

          if (this.selectedCategoryIds[index] == null) {

            console.warn(
              'Category not found for vegetable:',
              vegetableName,
              vegetableId
            );

          }

        });

        this.calculateTotal();

        this.isLoading = false;

      },

      error: (error) => {

        console.error('Could not load existing vegetables:', error);

        this.isLoading = false;

      }

    });

  }

  // =========================================
  // SAVE / UPDATE SALE
  // =========================================

  saveSale(): void {

    if (this.isLoading) {
      return;
    }

    if (!this.sale.customerId) {

      alert('Please select a Customer');

      return;
    }

    const validItems = this.sale.saleItems.filter(item =>

      item.vegetableId != null &&
      item.kg != null &&
      item.kg > 0 &&
      item.salePrice != null &&
      item.salePrice >= 0

    );

    if (validItems.length === 0) {

      alert('Please add at least one valid vegetable item');

      return;
    }

    const payload: Sale = {

      ...this.sale,

      saleItems: validItems

    };

    this.isLoading = true;

    // =====================================
    // UPDATE EXISTING SALE
    // =====================================

    if (this.isEdited) {

      if (this.saleId == null) {

        this.isLoading = false;

        alert('Sale ID is missing.');

        return;
      }

      this.saleService.editSale(payload, this.saleId).subscribe({

        next: (data: any) => {

          this.isLoading = false;

          alert(data.message || 'Sale updated successfully.');

        },

        error: (error) => {

          console.error('Sale update failed:', error);

          this.isLoading = false;

          alert('Sale update failed.');

        }

      });

      return;
    }

    // =====================================
    // ADD NEW SALE
    // =====================================

    this.saleService.addsale(payload).subscribe({

      next: () => {

        this.isLoading = false;

        alert('Sale saved successfully');

        this.resetForm();

      },

      error: (error) => {

        console.error('Error saving sale:', error);

        this.isLoading = false;

        alert('Failed to save sale. Please try again.');

      }

    });

  }

  // =========================================
  // RESET FORM
  // =========================================

  resetForm(): void {

    this.sale = {

      customerId: null,

      saleDate: this.formatDateTimeLocal(new Date()),

      crateCount: null,

      saleItems: []

    };

    this.customerSearchText = '';

    this.customers = [];

    this.selectedCategoryIds = [];

    this.rowVegetables = [];

    this.totalAmount = 0;

    this.isEdited = false;

    this.saleId = null;

    this.addItem();

  }

  editSale(): void {

    this.saveSale();

  }

}