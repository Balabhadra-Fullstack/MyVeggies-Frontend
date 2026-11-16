import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { commissionResponse } from 'src/app/Model/commissionResponse';
import { PurchaseResponse } from 'src/app/Model/PurchaseResponse';
import { SupplierPaymentResponseDTO } from 'src/app/Model/SupplierPaymentResponseDTO';
import { CommissionpurchaseService } from 'src/app/Service/commissionpurchase.service';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.css']
})
export class SupplierDetailsComponent implements OnInit {

  // Supplier object jo Existing Supplier component se aayega
  selectedSupplier: any = null;

  currentDate = new Date();


  // Purchase history
  purchases: PurchaseResponse[]= [];


  // Payment history
  payments: SupplierPaymentResponseDTO[] = [];


  // Commission purchase history
  commissionPurchases: commissionResponse[]= [];
 
  constructor(
    private router: Router,
    private purchaseServ: PurchaseServicService,
    private rout: ActivatedRoute,
    private supplierServ: SupplierServiceService,
    private commission: CommissionpurchaseService
  ) {}
 
totalcharges:number=0;
  ngOnInit(): void {
 
    const id = this.rout.snapshot.paramMap.get('id');

    console.log('ID FROM URL:', id);

    if (!id) {
      console.log('Supplier ID not found in URL');
      return;
    }

    const supplierId = Number(id);

    console.log('Supplier ID:', supplierId);

    const navigation = this.router.getCurrentNavigation();
    const stateSupplier = navigation?.extras?.state?.['supplier'] ?? history.state?.supplier;

    this.selectedSupplier = this.normalizeSupplier(stateSupplier);

    if (!this.selectedSupplier || !this.selectedSupplier.name) {
      this.supplierServ.getSupplierByid(supplierId).subscribe({
        next: (response:any) => {
          const result = Array.isArray(response) ? response[0] : response;
          this.selectedSupplier = this.normalizeSupplier(result);
        },
        error: (error) => {
          console.error('Error loading supplier details by id:', error);
        }
      });
    }

    console.log('Selected Supplier:', this.selectedSupplier);

    this.getPurchaseHistory(supplierId);
    this.getPaymentHistory(supplierId);
    this.getCommissionPurchases(supplierId);

  }

  private normalizeSupplier(supplier: any): any {
    if (!supplier) {
      return null;
    }

    return {
      ...supplier,
      id: supplier.id ?? supplier.supplierId ?? supplier.SupplierId,
      name: supplier.name ?? supplier.Suppliername ?? supplier.supplierName,
      mobileNumber: supplier.mobileNumber ?? supplier.mobile ?? supplier.MobileNumber,
      totalPurchase: supplier.totalPurchase ?? supplier.TotalAmountPurchaesd ?? supplier.totalAmountPurchased ?? 0,
      totalPaidAmount: supplier.totalPaidAmount ?? supplier.TotalAmountPaidByme ?? supplier.totalAmountPaid ?? 0,
      dueAmount: supplier.dueAmount ?? supplier.DueAmount ?? 0
    };
  }



  // =====================================================
  // PURCHASE HISTORY
  // =====================================================

  getPurchaseHistory(supplierId: number){

  this.purchaseServ.getLast3Purchase(supplierId).subscribe(data=>{
  this.purchases=data;
  } )

  }


  // =====================================================
  // PAYMENT HISTORY
  // =====================================================

  getPaymentHistory(supplierId: number): void {
   this.purchaseServ.getLast3Payment(supplierId).subscribe(payment=>{
    this.payments=payment;
   })
  }



  // =====================================================
  // COMMISSION PURCHASE HISTORY
  // =====================================================

 getCommissionPurchases(supplierId: number): void {
  this.commission.getRecent3CommissionPurchaseBySupplier(supplierId).subscribe({
    next: (data: commissionResponse[]) => {
      console.log('Commission purchases:', data);
      this.commissionPurchases = data;
    
    },
    error: error => {
      console.log('Commission error:', error);
    }
  });
}



  // =====================================================
  // WHATSAPP
  // =====================================================

  openWhatsApp(): void {
    const   lastPurchase = this.purchases[0];

const items = lastPurchase.purchaseItems
  .map(item =>
    `${item.vegetableName} - ${item.kg} kg @ ₹${item.purchasePrice}/kg`
  )
  .join('\n');

    if (!this.selectedSupplier) {

      alert('Supplier not found');

      return;
    }


    let mobile =
      this.selectedSupplier.mobileNumber;


    // India number ke liye
    if (mobile.length === 10) {

      mobile = '91' + mobile;

    }


  const message = `Hello ${this.selectedSupplier.name},

${this.currentDate}

Your account summary:

Last Supplied Items:
${items}
TotalAmount :
${lastPurchase.netAmount}
Now Due AMount is :₹${this.selectedSupplier.dueAmount}
---------------------------------------
TOTAL RECORD:
Total Purchase: ₹${this.selectedSupplier.TotalAmountPurchaesd}
Total Paid: ₹${this.selectedSupplier.TotalAmountPaidByme}


Thank you For Visiting.`;


    const whatsappUrl =
      `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;


    window.open(
      whatsappUrl,
      '_blank'
    );

  }



  // =====================================================
  // PRINT
  // =====================================================

  printStatement(): void {

    window.print();

  }

}