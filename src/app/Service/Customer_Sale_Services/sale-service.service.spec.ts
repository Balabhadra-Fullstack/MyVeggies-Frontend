import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SaleServiceService } from './sale-service.service';

describe('SaleServiceService', () => {
  let service: SaleServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SaleServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the latest 30 sales for the selected customer', () => {
    service.getLast30sale(42).subscribe((sales) => {
      expect(sales).toEqual([]);
    });

    const request = httpTestingController.expectOne(
      'http://localhost:8090/api/sale/last30/42'
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
