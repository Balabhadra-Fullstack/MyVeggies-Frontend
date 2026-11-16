
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SupplierResponse } from 'src/app/Model/SupplierResponse';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';
import { CommissionpurchaseService } from 'src/app/Service/commissionpurchase.service';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.css']
})
export class EditPurchaseComponent {

  constructor(
    private supplierService: SupplierServiceService,
    private purchaseService: PurchaseServicService,
    private commissionService: CommissionpurchaseService,
    private router: Router
  ) {}

  supplierSearch = '';

  filteredSuppliers: SupplierResponse[] = [];

  selectedSupplier: SupplierResponse | null = null;

  purchaseType: 'NORMAL' | 'COMMISSION' = 'NORMAL';

  purchases: any[] = [];

  isLoading = false;

  errorMessage = '';

  searchSupplier(): void {
    this.selectedSupplier = null;
    this.purchases = [];
    this.errorMessage = '';

    const name = this.supplierSearch.trim();

    if (!name) {
      this.filteredSuppliers = [];
      return;
    }

    this.supplierService.search(name).subscribe({
      next: (res: any) => {
        this.filteredSuppliers = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
      },
      error: (err: unknown) => {
        console.error('Supplier search failed:', err);
        this.filteredSuppliers = [];
        this.errorMessage = 'Unable to search suppliers.';
      }
    });
  }

  selectSupplier(supplier: SupplierResponse): void {
    this.selectedSupplier = supplier;
    this.supplierSearch = supplier.name;
    this.filteredSuppliers = [];

    this.loadPurchases();
  }

  onPurchaseTypeChange(): void {
    this.purchases = [];
    this.errorMessage = '';

    if (this.selectedSupplier) {
      this.loadPurchases();
    }
  }

  loadPurchases(): void {
    if (!this.selectedSupplier) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.purchases = [];

    const supplierId = this.selectedSupplier.id;

    const request: any = this.purchaseType === 'NORMAL'
      ? this.purchaseService.getRecentPurchasesBySupplier(supplierId)
      : this.commissionService.getRecent30CommissionPurchasesBySupplier(supplierId);

    // Prevent an undefined.subscribe runtime crash.
    // If this triggers, inspect the corresponding service method's return statement.
    if (!request || typeof request.subscribe !== 'function') {
      console.error(
        'Purchase service did not return an Observable.',
        this.purchaseType
      );

      this.errorMessage =
        'Unable to load purchases. Please check the purchase service method.';

      this.isLoading = false;
      return;
    }

    request.subscribe({
      next: (res: any) => {
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        this.purchases = data
          .slice()
          .sort((a: any, b: any) => {
            const dateA = this.getPurchaseDate(a);
            const dateB = this.getPurchaseDate(b);

            return dateB - dateA;
          })
          .slice(0, 30);

        this.isLoading = false;
      },

      error: (err: unknown) => {
        console.error('Unable to load purchases:', err);

        this.errorMessage = 'Unable to load purchases.';
        this.purchases = [];
        this.isLoading = false;
      }
    });
  }

  private getPurchaseDate(purchase: any): number {
    const dateValue =
      purchase.entryDate ??
      purchase.date ??
      purchase.entryDateTime ??
      null;

    if (!dateValue) {
      return 0;
    }

    const timestamp = new Date(dateValue).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  getPurchaseId(purchase: any): number | string | null {
    const id =
      purchase.purchaseId ??
      purchase.commissionPurchaseId ??
      purchase.id ??
      null;

    return id !== null && id !== undefined && id !== ''
      ? id
      : null;
  }

  editPurchase(purchase: any): void {
    const id = this.getPurchaseId(purchase);

    if (id === null) {
      this.errorMessage =
        'Cannot edit this purchase because its ID is missing from the response.';
      return;
    }

    const route = this.purchaseType === 'NORMAL'
      ? '/editPP'
      : '/editCP';

    this.router.navigate([route], {
      queryParams: { id }
    });
  }
}
