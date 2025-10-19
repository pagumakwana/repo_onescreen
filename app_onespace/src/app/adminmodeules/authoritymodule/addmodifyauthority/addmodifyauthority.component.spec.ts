import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifyauthorityComponent } from './addmodifyauthority.component';

describe('AddmodifyauthorityComponent', () => {
  let component: AddmodifyauthorityComponent;
  let fixture: ComponentFixture<AddmodifyauthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifyauthorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifyauthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
