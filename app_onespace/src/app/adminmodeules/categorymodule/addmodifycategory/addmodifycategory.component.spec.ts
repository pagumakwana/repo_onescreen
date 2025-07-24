import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifycategoryComponent } from './addmodifycategory.component';

describe('AddmodifycategoryComponent', () => {
  let component: AddmodifycategoryComponent;
  let fixture: ComponentFixture<AddmodifycategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifycategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifycategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
