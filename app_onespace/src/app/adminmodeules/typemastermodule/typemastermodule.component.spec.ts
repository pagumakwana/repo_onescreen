import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemastermoduleComponent } from './typemastermodule.component';

describe('TypemastermoduleComponent', () => {
  let component: TypemastermoduleComponent;
  let fixture: ComponentFixture<TypemastermoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypemastermoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypemastermoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
