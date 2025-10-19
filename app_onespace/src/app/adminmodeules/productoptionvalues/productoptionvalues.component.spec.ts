import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoptionvaluesComponent } from './productoptionvalues.component';

describe('ProductoptionvaluesComponent', () => {
  let component: ProductoptionvaluesComponent;
  let fixture: ComponentFixture<ProductoptionvaluesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoptionvaluesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoptionvaluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
