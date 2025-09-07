import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionistaLayoutComponent } from './recepcionista-layout.component';

describe('RecepcionistaLayoutComponent', () => {
  let component: RecepcionistaLayoutComponent;
  let fixture: ComponentFixture<RecepcionistaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionistaLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionistaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
