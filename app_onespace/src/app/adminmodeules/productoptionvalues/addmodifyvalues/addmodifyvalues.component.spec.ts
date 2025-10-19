import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifyvaluesComponent } from './addmodifyvalues.component';

describe('AddmodifyvaluesComponent', () => {
  let component: AddmodifyvaluesComponent;
  let fixture: ComponentFixture<AddmodifyvaluesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifyvaluesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifyvaluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
