import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.css']
})
export class EditPurchaseComponent {
  selectedDate: string = new Date().toISOString().split('T')[0];
  public purchases:any[]=[];
editPurchase(arg0: any) {

}
getPurchasesByDate() {

}
  

}
