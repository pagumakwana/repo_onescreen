import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewquotationComponent } from './viewquotation.component';

describe('ViewquotationComponent', () => {
  let component: ViewquotationComponent;
  let fixture: ComponentFixture<ViewquotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewquotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewquotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
