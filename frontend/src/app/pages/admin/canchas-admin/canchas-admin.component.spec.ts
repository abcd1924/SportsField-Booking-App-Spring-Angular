import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchasAdminComponent } from './canchas-admin.component';

describe('CanchasAdminComponent', () => {
  let component: CanchasAdminComponent;
  let fixture: ComponentFixture<CanchasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanchasAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
