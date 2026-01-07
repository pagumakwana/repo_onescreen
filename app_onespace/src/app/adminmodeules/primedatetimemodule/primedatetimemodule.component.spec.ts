import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimedatetimemoduleComponent } from './primedatetimemodule.component';

describe('PrimedatetimemoduleComponent', () => {
  let component: PrimedatetimemoduleComponent;
  let fixture: ComponentFixture<PrimedatetimemoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimedatetimemoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimedatetimemoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
