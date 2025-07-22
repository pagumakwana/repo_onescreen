import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthmoduleComponent } from './authmodule.component';

describe('AuthmoduleComponent', () => {
  let component: AuthmoduleComponent;
  let fixture: ComponentFixture<AuthmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
