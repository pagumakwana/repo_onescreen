import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelmoduleComponent } from './labelmodule.component';

describe('LabelmoduleComponent', () => {
  let component: LabelmoduleComponent;
  let fixture: ComponentFixture<LabelmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
