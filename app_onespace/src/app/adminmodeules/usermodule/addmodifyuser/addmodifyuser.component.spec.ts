import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifyuserComponent } from './addmodifyuser.component';

describe('AddmodifyuserComponent', () => {
  let component: AddmodifyuserComponent;
  let fixture: ComponentFixture<AddmodifyuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifyuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
