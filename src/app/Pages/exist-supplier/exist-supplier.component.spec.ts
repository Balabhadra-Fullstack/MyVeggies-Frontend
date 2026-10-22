import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistSupplierComponent } from './exist-supplier.component';

describe('ExistSupplierComponent', () => {
  let component: ExistSupplierComponent;
  let fixture: ComponentFixture<ExistSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExistSupplierComponent]
    });
    fixture = TestBed.createComponent(ExistSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
