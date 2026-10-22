import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/Model/Customer';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
 constructor(private router: Router,private service:CustomerServiceService) {}
 customer:Customer={
  name:'',
  mobileNumber:'',
  address:'',
  createdAt:''

 }
showAddSupplier = false;

openAddSupplier() {
  this.showAddSupplier = true;
}

closeAddSupplier() {
  this.showAddSupplier = false;
}

saveSupplier() {
 this.service.add(this.customer).subscribe({
  next:(data)=>{
    alert(data);
  },
  error:(err)=>{
    alert(err);
  }
 })
 this.customer={
  name:'',
  mobileNumber:'',
  address:'',
  createdAt:''
    };
  this.showAddSupplier = false;
}

viewSupplier() {
  this.router.navigate(['/exist-customer']);

}
}
