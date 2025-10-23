import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPolicyComponent } from './order-policy.component';

describe('OrderPolicyComponent', () => {
  let component: OrderPolicyComponent;
  let fixture: ComponentFixture<OrderPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
