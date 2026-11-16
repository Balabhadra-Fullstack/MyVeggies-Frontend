
import { Component, OnInit } from '@angular/core';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalSupplier = 0;
  totalCustomer = 0;

  supplierCount = 0;
  customerCount = 0;

  constructor(
    private sup: SupplierServiceService,
    private cus: CustomerServiceService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.sup.getAllSuppliers().subscribe({
      next: (data) => {
        this.totalSupplier = data.length;
        this.animateSupplier();
      },
      error: (error) => {
        console.log('Supplier loading error:', error);
      }
    });

    this.cus.getAllcustomers().subscribe({
      next: (data) => {
        this.totalCustomer = data.length;
        this.animateCustomer();
      },
      error: (error) => {
        console.log('Customer loading error:', error);
      }
    });

  }

  animateSupplier(): void {

    const target = this.totalSupplier;
    const duration = 1500;
    const startTime = Date.now();

    const timer = setInterval(() => {

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      this.supplierCount = Math.floor(target * progress);

      if (progress >= 1) {
        this.supplierCount = target;
        clearInterval(timer);
      }

    }, 20);
  }

  animateCustomer(): void {

    const target = this.totalCustomer;
    const duration = 1500;
    const startTime = Date.now();

    const timer = setInterval(() => {

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      this.customerCount = Math.floor(target * progress);

      if (progress >= 1) {
        this.customerCount = target;
        clearInterval(timer);
      }

    }, 20);
  }

}
