import { TestBed } from '@angular/core/testing';

import { BitchandiseService } from './bitchandise.service';

describe('BitchandiseService', () => {
  let service: BitchandiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitchandiseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
