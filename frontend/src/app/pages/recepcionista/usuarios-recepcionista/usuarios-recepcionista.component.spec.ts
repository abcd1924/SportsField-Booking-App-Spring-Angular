import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRecepcionistaComponent } from './usuarios-recepcionista.component';

describe('UsuariosRecepcionistaComponent', () => {
  let component: UsuariosRecepcionistaComponent;
  let fixture: ComponentFixture<UsuariosRecepcionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosRecepcionistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosRecepcionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
