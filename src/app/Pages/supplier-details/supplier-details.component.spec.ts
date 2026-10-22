import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PurchaseServicService } from 'src/app/Service/Supplier_Purchase_Services/purchase-service.service';

import { SupplierDetailsComponent } from './supplier-details.component';

describe('SupplierDetailsComponent', () => {
  let component: SupplierDetailsComponent;
  let fixture: ComponentFixture<SupplierDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierDetailsComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  supplier: {
                    id: 5,
                    Suppliername: 'Ravi',
                    mobileNumber: '9876543210',
                    TotalAmountPurchaesd: 1500,
                    TotalAmountPaidByme: 600,
                    DueAmount: 900
                  }
                }
              }
            })
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '5'
              }
            }
          }
        },
        {
          provide: PurchaseServicService,
          useValue: {
            getLast3Purchase: () => of([]),
            getLast3Payment: () => of([])
          }
        }
      ]
    });
    fixture = TestBed.createComponent(SupplierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read supplier from navigation state and normalize field names', () => {
    expect(component.selectedSupplier).toBeTruthy();
    expect(component.selectedSupplier.name).toBe('Ravi');
    expect(component.selectedSupplier.mobileNumber).toBe('9876543210');
    expect(component.selectedSupplier.totalPurchase).toBe(1500);
    expect(component.selectedSupplier.totalPaidAmount).toBe(600);
    expect(component.selectedSupplier.dueAmount).toBe(900);
  });
});
