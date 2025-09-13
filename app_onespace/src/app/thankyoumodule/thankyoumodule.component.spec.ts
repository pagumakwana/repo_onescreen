import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyoumoduleComponent } from './thankyoumodule.component';

describe('ThankyoumoduleComponent', () => {
  let component: ThankyoumoduleComponent;
  let fixture: ComponentFixture<ThankyoumoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankyoumoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankyoumoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
