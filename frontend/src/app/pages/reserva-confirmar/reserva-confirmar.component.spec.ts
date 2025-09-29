import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaConfirmarComponent } from './reserva-confirmar.component';

describe('ReservaConfirmarComponent', () => {
  let component: ReservaConfirmarComponent;
  let fixture: ComponentFixture<ReservaConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaConfirmarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
