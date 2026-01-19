import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsmoduleComponent } from './leadsmodule.component';

describe('LeadsmoduleComponent', () => {
  let component: LeadsmoduleComponent;
  let fixture: ComponentFixture<LeadsmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
