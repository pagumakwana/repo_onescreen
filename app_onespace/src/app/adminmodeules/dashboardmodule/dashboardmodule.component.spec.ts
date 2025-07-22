import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardmoduleComponent } from './dashboardmodule.component';

describe('DashboardmoduleComponent', () => {
  let component: DashboardmoduleComponent;
  let fixture: ComponentFixture<DashboardmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
