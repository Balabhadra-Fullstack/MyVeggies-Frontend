import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/Model/Supplier';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent {
  supplier:Supplier={
    name:'',
    mobileNumber:'',
    address:'',
    createdAt:''
  }
viewCommissionSupplier() {
throw new Error('Method not implemented.');
}

  constructor(private router: Router,private service:SupplierServiceService) {}
showAddSupplier = false;

openAddSupplier() {

  this.showAddSupplier = true;

  const now = new Date();

  now.setMinutes(
    now.getMinutes() - now.getTimezoneOffset()
  );

  this.supplier.createdAt = now.toISOString().slice(0, 16);
}

closeAddSupplier() {
  this.showAddSupplier = false;
}

saveSupplier() {

  this.service.addSupplier(this.supplier).subscribe({

    next: (data) => {

   Swal.fire({
  icon: 'success',
  title: 'Supplier Added!',
  text: data.message,
  confirmButtonText: 'Continue',

  background: '#ffffff',
  color: '#1f2937',

  confirmButtonColor: '#16a34a',

  width: '400px',

  customClass: {
    popup: 'custom-swal-popup',
    title: 'custom-swal-title',
    htmlContainer: 'custom-swal-text',
    confirmButton: 'custom-swal-button'
  },

  buttonsStyling: true
});

      // Reset only after successful save
      this.supplier = {
        name: '',
        mobileNumber: '',
        address: '',
        createdAt:''
      };

      this.showAddSupplier = false;
    },

   error: (err) => {

  Swal.fire({
    icon: 'error',
    title: 'Error!',
    text: err.error?.message || 'Something went wrong.',
    confirmButtonText: 'OK',

    background: '#ffffff',
    color: '#1f2937',

    confirmButtonColor: '#dc2626',

    width: '400px',
      

    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-text',
      confirmButton: 'custom-swal-button'
    },

    buttonsStyling: true
  });

}

  });

}

viewSupplier() {
  this.router.navigate(['/exist-supplier']);

}
}
