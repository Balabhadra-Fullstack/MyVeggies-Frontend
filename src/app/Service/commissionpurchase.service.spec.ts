import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommissionRequest } from '../Model/commissionRequest';

import { CommissionpurchaseService } from './commissionpurchase.service';

describe('CommissionpurchaseService', () => {
  let service: CommissionpurchaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CommissionpurchaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts the commission request to the add endpoint', () => {
    const request: CommissionRequest = {
      supplierId: 4,
      truckNumber: 'TR-123',
      date: '2026-10-24',
      commissionRate: 8,
      items: [{ vegetableId: 2, quantity: 10, rate: 15, amount: 150 }],
      truckcharges: 20,
      laborCharges: 5,
      otherCharges: 0
    };
    const response = { message: 'Saved' };

    service.addCommissionPurchase(request).subscribe(result => {
      expect(result).toEqual(response);
    });

    const httpRequest = httpMock.expectOne(`${service.baseurl}/add`);
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush(response);
  });
});
