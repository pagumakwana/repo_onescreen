import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendormoduleComponent } from './vendormodule.component';

describe('VendormoduleComponent', () => {
  let component: VendormoduleComponent;
  let fixture: ComponentFixture<VendormoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendormoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendormoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
