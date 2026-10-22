import { TestBed } from '@angular/core/testing';

import { VegitableServicesService } from './vegitable-services.service';

describe('VegitableServicesService', () => {
  let service: VegitableServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VegitableServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
