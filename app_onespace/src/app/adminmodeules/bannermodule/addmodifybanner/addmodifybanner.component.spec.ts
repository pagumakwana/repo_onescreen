import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifybannerComponent } from './addmodifybanner.component';

describe('AddmodifybannerComponent', () => {
  let component: AddmodifybannerComponent;
  let fixture: ComponentFixture<AddmodifybannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifybannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifybannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
