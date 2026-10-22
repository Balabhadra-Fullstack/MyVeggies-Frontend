import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})
export class EditSaleComponent {
  selectedDate: string = new Date().toISOString().split('T')[0];
  public sales:any[]=[];
editSale(arg0: any) {

}
getSalesByDate() {

}

}
