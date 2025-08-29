import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupmoduleComponent } from './signupmodule.component';

describe('SignupmoduleComponent', () => {
  let component: SignupmoduleComponent;
  let fixture: ComponentFixture<SignupmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
