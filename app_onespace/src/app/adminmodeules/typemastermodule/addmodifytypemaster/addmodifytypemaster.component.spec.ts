import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodifytypemasterComponent } from './addmodifytypemaster.component';

describe('AddmodifytypemasterComponent', () => {
  let component: AddmodifytypemasterComponent;
  let fixture: ComponentFixture<AddmodifytypemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmodifytypemasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmodifytypemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
