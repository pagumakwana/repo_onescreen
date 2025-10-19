import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifyoptionComponent } from './addmodifyoption.component';

describe('AddmodifyoptionComponent', () => {
  let component: AddmodifyoptionComponent;
  let fixture: ComponentFixture<AddmodifyoptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifyoptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifyoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
