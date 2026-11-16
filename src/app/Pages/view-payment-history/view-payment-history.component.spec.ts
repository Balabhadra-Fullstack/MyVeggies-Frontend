import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentHistoryComponent } from './view-payment-history.component';

describe('ViewPaymentHistoryComponent', () => {
  let component: ViewPaymentHistoryComponent;
  let fixture: ComponentFixture<ViewPaymentHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPaymentHistoryComponent]
    });
    fixture = TestBed.createComponent(ViewPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
