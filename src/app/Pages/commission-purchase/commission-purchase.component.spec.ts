import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionPurchaseComponent } from './commission-purchase.component';

describe('CommissionPurchaseComponent', () => {
  let component: CommissionPurchaseComponent;
  let fixture: ComponentFixture<CommissionPurchaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionPurchaseComponent]
    });
    fixture = TestBed.createComponent(CommissionPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
