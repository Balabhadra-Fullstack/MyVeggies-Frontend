import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchSupplier } from 'src/app/Model/SearchSupplier';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';

@Component({
  selector: 'app-exist-supplier',
  templateUrl: './exist-supplier.component.html',
  styleUrls: ['./exist-supplier.component.css']
})
export class ExistSupplierComponent {

    searchText: string = '';

  suppliers:SearchSupplier[] = [];


  constructor(
    private router: Router,
    private serv:SupplierServiceService
  ) {}

ngOnInit(){
 
}
  goBack() {

    this.router.navigate(['/Supplier']);

  }

searchSupplier() {
  this.serv.searchSupplier(this.searchText).subscribe(data=>{
    this.suppliers=data;
  })
}
 openSupplier(supplier:SearchSupplier) {

    this.router.navigate(
      ['/supplier-details',supplier.id],
      { state: { supplier } }
    );

  }

}
