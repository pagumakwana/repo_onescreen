import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoritymoduleComponent } from './authoritymodule.component';

describe('AuthoritymoduleComponent', () => {
  let component: AuthoritymoduleComponent;
  let fixture: ComponentFixture<AuthoritymoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthoritymoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthoritymoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
