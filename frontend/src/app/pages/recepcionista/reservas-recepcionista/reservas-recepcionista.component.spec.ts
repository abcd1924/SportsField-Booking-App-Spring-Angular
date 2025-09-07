import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasRecepcionistaComponent } from './reservas-recepcionista.component';

describe('ReservasRecepcionistaComponent', () => {
  let component: ReservasRecepcionistaComponent;
  let fixture: ComponentFixture<ReservasRecepcionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasRecepcionistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasRecepcionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
