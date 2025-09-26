import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlmoduleComponent } from './controlmodule.component';

describe('ControlmoduleComponent', () => {
  let component: ControlmoduleComponent;
  let fixture: ComponentFixture<ControlmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
