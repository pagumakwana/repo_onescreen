import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifyproductComponent } from './addmodifyproduct.component';

describe('AddmodifyproductComponent', () => {
  let component: AddmodifyproductComponent;
  let fixture: ComponentFixture<AddmodifyproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifyproductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifyproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
