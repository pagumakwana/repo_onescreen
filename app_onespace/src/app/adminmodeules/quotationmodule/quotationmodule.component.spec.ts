import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationmoduleComponent } from './quotationmodule.component';

describe('QuotationmoduleComponent', () => {
  let component: QuotationmoduleComponent;
  let fixture: ComponentFixture<QuotationmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
