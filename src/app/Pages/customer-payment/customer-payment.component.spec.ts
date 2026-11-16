import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CustomerPaymentResponse } from 'src/app/Model/CustomerPaymentResponse';
import { CustomerServiceService } from 'src/app/Service/Customer_Sale_Services/customer-service.service';
import { SaleServiceService } from 'src/app/Service/Customer_Sale_Services/sale-service.service';
import Swal from 'sweetalert2';
import { CustomerPaymentComponent } from './customer-payment.component';

describe('CustomerPaymentComponent', () => {
  let component: CustomerPaymentComponent;
  let fixture: ComponentFixture<CustomerPaymentComponent>;
  let saleService: jasmine.SpyObj<SaleServiceService>;

  const payment: CustomerPaymentResponse = {
    paymentId: 73,
    customerId: 42,
    customerName: 'Customer One',
    amount: 150,
    method: 'UPI',
    dateTime: '2026-11-16'
  };

  beforeEach(() => {
    saleService = jasmine.createSpyObj<SaleServiceService>(
      'SaleServiceService',
      ['getpaymentByIdForEdit', 'editPayment', 'addpayment']
    );
    saleService.getpaymentByIdForEdit.and.returnValue(of(payment));
    saleService.editPayment.and.returnValue(of({ message: 'updated' }));
    saleService.addpayment.and.returnValue(of({ message: 'added' }));

    const customerService = jasmine.createSpyObj<CustomerServiceService>(
      'CustomerServiceService',
      ['search']
    );
    customerService.search.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [CustomerPaymentComponent],
      providers: [
        { provide: CustomerServiceService, useValue: customerService },
        { provide: SaleServiceService, useValue: saleService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '73' } } }
        }
      ]
    });

    fixture = TestBed.createComponent(CustomerPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the payment and retain separate payment and customer IDs', () => {
    expect(component).toBeTruthy();
    expect(component.paymentId).toBe(73);
    expect(component.customerId).toBe(42);
    expect(component.customerSearch).toBe('Customer One');
    expect(component.payment.paymentamount).toBe(150);
    expect(component.payment.paymenttime).toBe('2026-11-16');
  });

  it('should update the payment by payment ID with the customer ID in the request', () => {
    spyOn(Swal, 'fire');

    component.savePayment();

    expect(saleService.editPayment).toHaveBeenCalledWith(73, {
      id: 42,
      paymentamount: 150,
      paymentmethod: 'UPI',
      paymenttime: '2026-11-16'
    });
  });

  it('should clear the selected customer when the search text changes', () => {
    component.customerSearch = 'Another customer';

    component.searchCustomer();

    expect(component.customerId).toBeNull();
  });
});
