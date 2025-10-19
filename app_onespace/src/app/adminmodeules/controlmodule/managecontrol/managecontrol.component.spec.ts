import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecontrolComponent } from './managecontrol.component';

describe('ManagecontrolComponent', () => {
  let component: ManagecontrolComponent;
  let fixture: ComponentFixture<ManagecontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagecontrolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagecontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
