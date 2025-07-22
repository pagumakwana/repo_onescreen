import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminmodeulesComponent } from './adminmodeules.component';

describe('AdminmodeulesComponent', () => {
  let component: AdminmodeulesComponent;
  let fixture: ComponentFixture<AdminmodeulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminmodeulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminmodeulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
