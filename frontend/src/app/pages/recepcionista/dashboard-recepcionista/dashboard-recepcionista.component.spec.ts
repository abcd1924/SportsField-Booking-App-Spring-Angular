import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecepcionistaComponent } from './dashboard-recepcionista.component';

describe('DashboardRecepcionistaComponent', () => {
  let component: DashboardRecepcionistaComponent;
  let fixture: ComponentFixture<DashboardRecepcionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecepcionistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRecepcionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
