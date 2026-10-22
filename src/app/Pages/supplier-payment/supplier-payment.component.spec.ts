import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SupplierPaymentComponent } from './supplier-payment.component';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';

describe('SupplierPaymentComponent', () => {
  let component: SupplierPaymentComponent;
  let fixture: ComponentFixture<SupplierPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierPaymentComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: SupplierServiceService,
          useValue: { search: () => of([]) }
        },
        {
          provide: PurchaseServicService,
          useValue: { addpayment: () => of({ message: '' }) }
        }
      ]
    });
    fixture = TestBed.createComponent(SupplierPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
