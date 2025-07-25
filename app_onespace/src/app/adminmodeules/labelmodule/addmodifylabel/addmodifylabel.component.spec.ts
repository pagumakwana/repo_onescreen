import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifylabelComponent } from './addmodifylabel.component';

describe('AddmodifylabelComponent', () => {
  let component: AddmodifylabelComponent;
  let fixture: ComponentFixture<AddmodifylabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifylabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifylabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
