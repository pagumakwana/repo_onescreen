import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseordermoduleComponent } from './purchaseordermodule.component';

describe('PurchaseordermoduleComponent', () => {
  let component: PurchaseordermoduleComponent;
  let fixture: ComponentFixture<PurchaseordermoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseordermoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseordermoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
