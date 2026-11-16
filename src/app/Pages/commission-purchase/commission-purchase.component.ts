
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

import { CommissionPurchaseItemDTO } from 'src/app/Model/CommissionPurchaseItemDTO';
import { CommissionRequest } from 'src/app/Model/commissionRequest';
import { SupplierResponse } from 'src/app/Model/SupplierResponse';
import { Vegetable } from 'src/app/Model/Vegetable';

import { CommissionpurchaseService } from 'src/app/Service/commissionpurchase.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';
import { VegitableServicesService } from 'src/app/Service/vegitable_ Category_ Services/vegitable-services.service';

@Component({
  selector: 'app-commission-purchase',
  templateUrl: './commission-purchase.component.html',
  styleUrls: ['./commission-purchase.component.css']
})
export class CommissionPurchaseComponent implements OnInit {

  constructor(
    private commissionService: CommissionpurchaseService,
    private supplierService: SupplierServiceService,
    private vegetableService: VegitableServicesService,
    private rout: ActivatedRoute
  ) {}

  supplierSearch = '';
  filteredSuppliers: SupplierResponse[] = [];
  vegetables: Vegetable[] = [];

  commissionPurchase: CommissionRequest = this.createEmptyPurchase();

  errorMessage = '';
  successMessage = '';

  isSaving = false;
  isedited = false;

  // Existing purchase ID for update
  commissionPurchaseId: number | null = null;


  ngOnInit(): void {

    this.loadVegetables();

    this.loadCommission();

  }


  // =====================================
  // SUPPLIER SEARCH
  // =====================================

  searchSupplier(): void {

    const search = this.supplierSearch.trim();

    this.commissionPurchase.supplierId = null;

    this.errorMessage = '';

    if (!search) {
      this.filteredSuppliers = [];
      return;
    }

    this.supplierService.search(search).subscribe({

      next: suppliers => {
        this.filteredSuppliers = suppliers;
      },

      error: (error: unknown) => {

        console.error('Error searching suppliers:', error);

        this.filteredSuppliers = [];

        this.showError(
          'Unable to load suppliers. Please try again.'
        );

      }

    });

  }


  selectSupplier(supplier: SupplierResponse): void {

    this.commissionPurchase.supplierId = supplier.id;

    this.supplierSearch = supplier.name;

    this.filteredSuppliers = [];

  }


  // =====================================
  // VEGETABLE ITEMS
  // =====================================

  addVegetable(): void {

    this.commissionPurchase.items.push({

      vegetableId: null,
      quantity: 0,
      rate: 0,
      amount: 0

    });

  }


  removeVegetable(index: number): void {

    this.commissionPurchase.items.splice(index, 1);

  }


  clearItems(): void {

    this.commissionPurchase.items = [];

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =====================================
  // CALCULATIONS
  // =====================================

  getTotalSale(): number {

    return this.commissionPurchase.items.reduce(

      (total: number, item: CommissionPurchaseItemDTO) => {

        const quantity = Number(item.quantity) || 0;

        const rate = Number(item.rate) || 0;

        return total + quantity * rate;

      },

      0

    );

  }


  getCommissionAmount(): number {

    const totalSale = this.getTotalSale();

    const rate =
      Number(this.commissionPurchase.commissionRate) || 0;

    return totalSale * rate / 100;

  }


  getSupplierPayable(): number {

    const totalSale = this.getTotalSale();

    const commission = this.getCommissionAmount();

    const truckCharge =
      Number(this.commissionPurchase.truckcharges) || 0;

    const laborCharge =
      Number(this.commissionPurchase.laborCharges) || 0;

    const otherCharge =
      Number(this.commissionPurchase.otherCharges) || 0;

    return totalSale -
      commission -
      truckCharge -
      laborCharge -
      otherCharge;

  }


  // =====================================
  // SAVE / UPDATE PURCHASE
  // =====================================

  saveCommissionPurchase(): void {

    if (this.isSaving) {
      return;
    }

    const purchase = this.commissionPurchase;


    // Supplier validation

    if (purchase.supplierId === null) {

      this.showError('Please select a supplier.');

      return;

    }


    // Date validation

    if (!purchase.date) {

      this.showError('Please select the purchase date.');

      return;

    }


    // Items validation

    if (purchase.items.length === 0) {

      this.showError('Please add at least one vegetable.');

      return;

    }


    const invalidItem = purchase.items.some(

      item =>
        item.vegetableId === null ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        !Number.isFinite(Number(item.rate)) ||
        Number(item.rate) < 0

    );


    if (invalidItem) {

      this.showError(
        'Please select a vegetable and enter valid quantity and price.'
      );

      return;

    }


    // Commission and charges validation

    const commissionRate = Number(purchase.commissionRate);

    const charges = [

      purchase.truckcharges,
      purchase.laborCharges,
      purchase.otherCharges

    ];


    if (

      !Number.isFinite(commissionRate) ||
      commissionRate < 0 ||
      commissionRate > 100 ||

      charges.some(

        charge =>
          !Number.isFinite(Number(charge)) ||
          Number(charge) < 0

      )

    ) {

      this.showError(
        'Enter a commission rate from 0 to 100 and non-negative charges.'
      );

      return;

    }


    // Prepare request for backend

    const request: CommissionRequest = {

      ...purchase,

      commissionRate: commissionRate,

      truckcharges: Number(purchase.truckcharges),

      laborCharges: Number(purchase.laborCharges),

      otherCharges: Number(purchase.otherCharges),

      items: purchase.items.map(item => ({

        ...item,

        quantity: Number(item.quantity),

        rate: Number(item.rate),

        amount: Number(item.quantity) * Number(item.rate)

      }))

    };


    this.errorMessage = '';

    this.successMessage = '';

    this.isSaving = true;


    // Decide Add or Update

    if (this.isedited && this.commissionPurchaseId === null) {

      this.isSaving = false;

      this.showError('Purchase ID is missing. Unable to update.');

      return;

    }

    const apiCall = this.isedited

      ? this.commissionService.updatecommissionpurchase(
          this.commissionPurchaseId!,
          request
        )

      : this.commissionService.addCommissionPurchase(request);


    apiCall.subscribe({

      next: response => {

        this.isSaving = false;

        Swal.fire({

          icon: 'success',

          title: this.isedited
            ? 'Purchase Updated!'
            : 'Purchase Saved!',

          text: response.message ||
            'Commission purchase operation successful.',

          confirmButtonText: 'Continue',

          confirmButtonColor: '#159447'

        }).then(result => {

          if (result.isConfirmed) {

            this.commissionPurchase = this.createEmptyPurchase();

            this.supplierSearch = '';

            this.filteredSuppliers = [];

            this.commissionPurchaseId = null;

            this.isedited = false;

            this.errorMessage = '';

            this.successMessage = '';

          }

        });

      },


      error: (error: unknown) => {

        console.error(
          'Commission purchase operation failed:',
          error
        );

        this.isSaving = false;

        Swal.fire({

          icon: 'error',

          title: 'Operation Failed!',

          text:
            'Failed to save commission purchase. Please try again.',

          confirmButtonText: 'OK',

          confirmButtonColor: '#dc3545'

        });

      }

    });

  }


  // =====================================
  // ERROR ALERT
  // =====================================

  private showError(message: string): void {

    Swal.fire({

      icon: 'warning',

      title: 'Check Details',

      text: message,

      confirmButtonText: 'OK',

      confirmButtonColor: '#159447'

    });

  }


  // =====================================
  // LOAD VEGETABLES
  // =====================================

  private loadVegetables(): void {

    this.vegetableService.getallVegetablecategory().subscribe({

      next: categories => {

        if (categories.length === 0) {

          this.vegetables = [];

          return;

        }

        forkJoin(

          categories.map(category =>

            this.vegetableService.getvegetableByCartegory(
              category.id
            )

          )

        ).subscribe({

          next: vegetableGroups => {

            this.vegetables = vegetableGroups.flat();

          },

          error: (error: unknown) => {

            console.error(
              'Error loading commission vegetables:',
              error
            );

            this.showError(
              'Unable to load vegetables. Please try again.'
            );

          }

        });

      },

      error: (error: unknown) => {

        console.error(
          'Error loading vegetable categories:',
          error
        );

        this.showError(
          'Unable to load vegetable categories. Please try again.'
        );

      }

    });

  }


  // =====================================
  // EMPTY PURCHASE
  // =====================================

  private createEmptyPurchase(): CommissionRequest {

    return {

      supplierId: null,

      truckNumber: '',

      date: '',

      commissionRate: 8,

      items: [],

      truckcharges: 0,

      laborCharges: 0,

      otherCharges: 0

    };

  }


  // =====================================
  // LOAD PURCHASE FOR EDIT
  // =====================================

  loadCommission(): void {

    this.rout.queryParamMap.subscribe(param => {

      const id = param.get('id');

      if (!id) {

        return;

      }

      this.commissionService.getcommissionByid(Number(id)).subscribe({

        next: (response: any) => {

          const data = response.data;

          // Store existing purchase ID

          this.commissionPurchaseId = data.id;


          // Map backend response to Angular request

          this.commissionPurchase = {

            supplierId: data.supplier.id,

            truckNumber: data.truckNumber,

            date: data.purchaseDate,

            commissionRate: data.commissionRate,

            items: data.items.map((item: any) => ({

              vegetableId: item.vegetable.id,

              quantity: item.quantity,

              rate: item.rate,

              amount: item.amount

            })),

            truckcharges: data.truckCharges,

            laborCharges: data.laborCharges,

            otherCharges: data.otherCharges

          };


          // Bind supplier name

          this.supplierSearch = data.supplier.name;


          // Enable edit mode

          this.isedited = true;


          console.log(
            'EDIT PURCHASE ID:',
            this.commissionPurchaseId
          );

          console.log(
            'EDIT PURCHASE DATA:',
            this.commissionPurchase
          );

        },

        error: (error: unknown) => {

          console.error(
            'Error loading commission purchase:',
            error
          );

          this.showError(
            'Unable to load purchase details.'
          );

        }

      });

    });

  }

}
