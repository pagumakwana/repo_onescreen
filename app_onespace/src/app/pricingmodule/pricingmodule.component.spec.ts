import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingmoduleComponent } from './pricingmodule.component';

describe('PricingmoduleComponent', () => {
  let component: PricingmoduleComponent;
  let fixture: ComponentFixture<PricingmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
