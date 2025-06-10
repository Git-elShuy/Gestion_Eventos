import { TestBed } from '@angular/core/testing';

import { SaadminguardService } from './saadminguard.service';

describe('SaadminguardService', () => {
  let service: SaadminguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaadminguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
