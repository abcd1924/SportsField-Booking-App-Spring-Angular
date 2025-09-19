import { TestBed } from '@angular/core/testing';

import { HorarioCanchaService } from './horario-cancha.service';

describe('HorarioCanchaService', () => {
  let service: HorarioCanchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioCanchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
