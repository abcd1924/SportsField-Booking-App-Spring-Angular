import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchasFormComponent } from './canchas-form.component';

describe('CanchasFormComponent', () => {
  let component: CanchasFormComponent;
  let fixture: ComponentFixture<CanchasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanchasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
