import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusmoduleComponent } from './contactusmodule.component';

describe('ContactusmoduleComponent', () => {
  let component: ContactusmoduleComponent;
  let fixture: ComponentFixture<ContactusmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactusmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactusmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
