import { TestBed } from '@angular/core/testing';

import { CanchaDeportivaService } from './cancha-deportiva.service';

describe('CanchaDeportivaService', () => {
  let service: CanchaDeportivaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanchaDeportivaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
