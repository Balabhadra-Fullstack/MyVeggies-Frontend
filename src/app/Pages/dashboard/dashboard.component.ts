import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
recentPurchases: any;
totalPurchase: any=1000;
totalPaid: any=500;
totalDue: any=500;
totalSuppliers: any=20;

}
