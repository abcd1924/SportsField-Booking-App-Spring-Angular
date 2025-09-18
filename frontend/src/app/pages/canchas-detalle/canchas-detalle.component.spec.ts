import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchasDetalleComponent } from './canchas-detalle.component';

describe('CanchasDetalleComponent', () => {
  let component: CanchasDetalleComponent;
  let fixture: ComponentFixture<CanchasDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanchasDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
