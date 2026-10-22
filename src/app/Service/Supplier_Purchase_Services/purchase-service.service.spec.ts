import { TestBed } from '@angular/core/testing';

import { PurchaseServicService } from './purchase-service.service';

describe('PurchaseServicService', () => {
  let service: PurchaseServicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseServicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
