import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { CommissionPurchaseComponent } from './commission-purchase.component';
import { CommissionpurchaseService } from 'src/app/Service/commissionpurchase.service';
import { SupplierServiceService } from 'src/app/Service/Supplier_Purchase_Services/supplier-service.service';
import { VegitableServicesService } from 'src/app/Service/vegitable_ Category_ Services/vegitable-services.service';

describe('CommissionPurchaseComponent', () => {
  let component: CommissionPurchaseComponent;
  let fixture: ComponentFixture<CommissionPurchaseComponent>;
  let commissionService: jasmine.SpyObj<CommissionpurchaseService>;
  let supplierService: jasmine.SpyObj<SupplierServiceService>;
  let queryParamMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(() => {
    commissionService = jasmine.createSpyObj<CommissionpurchaseService>(
      'CommissionpurchaseService',
      ['addCommissionPurchase', 'getcommissionByid']
    );
    commissionService.addCommissionPurchase.and.returnValue(of({ message: 'Saved' }));
    supplierService = jasmine.createSpyObj<SupplierServiceService>(
      'SupplierServiceService',
      ['search', 'getSupplierByid']
    );
    supplierService.search.and.returnValue(of([]));
    supplierService.getSupplierByid.and.returnValue(of([]));
    queryParamMap = new BehaviorSubject(convertToParamMap({}));

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [CommissionPurchaseComponent],
      providers: [
        { provide: CommissionpurchaseService, useValue: commissionService },
        { provide: SupplierServiceService, useValue: supplierService },
        { provide: ActivatedRoute, useValue: { queryParamMap } },
        {
          provide: VegitableServicesService,
          useValue: {
            getallVegetablecategory: jasmine.createSpy().and.returnValue(of([])),
            getvegetableByCartegory: jasmine.createSpy().and.returnValue(of([]))
          }
        }
      ]
    });
    fixture = TestBed.createComponent(CommissionPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends a request matching the commission DTO and resets after saving', () => {
    component.commissionPurchase = {
      supplierId: 4,
      truckNumber: 'TR-123',
      date: '2026-10-24',
      commissionRate: 8,
      items: [{ vegetableId: 2, quantity: 10, rate: 15, amount: 0 }],
      truckcharges: 20,
      laborCharges: 5,
      otherCharges: 0
    };

    component.saveCommissionPurchase();

    expect(commissionService.addCommissionPurchase).toHaveBeenCalledWith({
      supplierId: 4,
      truckNumber: 'TR-123',
      date: '2026-10-24',
      commissionRate: 8,
      items: [{ vegetableId: 2, quantity: 10, rate: 15, amount: 150 }],
      truckcharges: 20,
      laborCharges: 5,
      otherCharges: 0
    });
    expect(component.commissionPurchase.supplierId).toBeNull();
    expect(component.successMessage).toBe('Saved');
  });

  it('loads the purchase and supplier for editing from the query ID', () => {
    commissionService.getcommissionByid.and.returnValue(of({
      supplierId: 4,
      truckNumber: 'TR-123',
      date: '2026-10-24',
      commissionRate: 8,
      items: [{ vegetableId: 2, quantity: 10, rate: 15, amount: 150 }],
      truckcharges: 20,
      laborCharges: 5,
      otherCharges: 0
    }));
    supplierService.getSupplierByid.and.returnValue(of([{
      id: 4,
      name: 'Supplier 4',
      mobileNumber: '1234567890',
      address: 'Market'
    }]));

    queryParamMap.next(convertToParamMap({ id: '12' }));

    expect(commissionService.getcommissionByid).toHaveBeenCalledWith(12);
    expect(component.commissionPurchase.supplierId).toBe(4);
    expect(component.commissionPurchase.items[0].vegetableId).toBe(2);
    expect(component.supplierSearch).toBe('Supplier 4');
    expect(component.isedited).toBeTrue();
  });
});
