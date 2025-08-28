import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifyvendorComponent } from './addmodifyvendor.component';

describe('AddmodifyvendorComponent', () => {
  let component: AddmodifyvendorComponent;
  let fixture: ComponentFixture<AddmodifyvendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifyvendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifyvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
