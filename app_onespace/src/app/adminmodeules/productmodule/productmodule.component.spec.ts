import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductmoduleComponent } from './productmodule.component';

describe('ProductmoduleComponent', () => {
  let component: ProductmoduleComponent;
  let fixture: ComponentFixture<ProductmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
