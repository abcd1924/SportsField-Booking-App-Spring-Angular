import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobantesRecepcionistaComponent } from './comprobantes-recepcionista.component';

describe('ComprobantesRecepcionistaComponent', () => {
  let component: ComprobantesRecepcionistaComponent;
  let fixture: ComponentFixture<ComprobantesRecepcionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprobantesRecepcionistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobantesRecepcionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
