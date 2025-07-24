import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermoduleComponent } from './usermodule.component';

describe('UsermoduleComponent', () => {
  let component: UsermoduleComponent;
  let fixture: ComponentFixture<UsermoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsermoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsermoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
