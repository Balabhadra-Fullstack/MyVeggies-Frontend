import { Component, OnInit } from '@angular/core';
import { SupplierPayemnt } from 'src/app/Model/SupplierPayment';
import { SupplierResponse } from 'src/app/Model/SupplierResponse';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-payment',
  templateUrl: './supplier-payment.component.html',
  styleUrls: ['./supplier-payment.component.css']
})
export class SupplierPaymentComponent implements OnInit {
  constructor(
    private supplierService: SupplierServiceService,
    private purchaseService: PurchaseServicService,
  ) {}

  suppliers: SupplierResponse[] = [];
  supplierSearch = '';
  filteredSuppliers: SupplierResponse[] = [];
  showSupplierDropdown = false;

  payment: SupplierPayemnt = {
    id: null,
    paymentamount: null,
    paymentmethod: '',
    paymenttime: ''
  };

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.search(this.supplierSearch).subscribe({
      next: (data: SupplierResponse[]) => {
        this.suppliers = data;
      },
      error: (error: unknown) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }

  searchSupplier(): void {
    const search = this.supplierSearch.trim().toLowerCase();
    this.payment.id = null;
    this.showSupplierDropdown = true;

    if (!search) {
      this.filteredSuppliers = [];
      return;
    }

    this.filteredSuppliers = this.suppliers.filter(
      supplier => supplier.name && supplier.name.toLowerCase().includes(search)
    );
  }

  selectSupplier(supplier: SupplierResponse): void {
    this.payment.id = supplier.id;
    this.supplierSearch = supplier.name;
    this.showSupplierDropdown = false;
    this.filteredSuppliers = [];
  }

 savePayment(): void {
  this.purchaseService.addpayment(this.payment).subscribe({
    next: response => {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: response.message || 'Payment saved successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'payment-toast'
        }
      });

      this.payment = {
        id: null,
        paymentamount: null,
        paymentmethod: '',
        paymenttime: ''
      };

      this.supplierSearch = '';
      this.filteredSuppliers = [];
      this.showSupplierDropdown = false;
    },

    error: (error: unknown) => {
      console.error('Error saving payment:', error);

      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'error',
        title: 'Failed to save payment!',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        customClass: {
          popup: 'payment-toast'
        }
      });
    }
  });
}
}
