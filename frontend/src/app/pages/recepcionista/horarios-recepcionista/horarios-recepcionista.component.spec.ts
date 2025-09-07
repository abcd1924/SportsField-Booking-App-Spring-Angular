import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosRecepcionistaComponent } from './horarios-recepcionista.component';

describe('HorariosRecepcionistaComponent', () => {
  let component: HorariosRecepcionistaComponent;
  let fixture: ComponentFixture<HorariosRecepcionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosRecepcionistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorariosRecepcionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
