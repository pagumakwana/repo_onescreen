import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdermoduleComponent } from './ordermodule.component';

describe('OrdermoduleComponent', () => {
  let component: OrdermoduleComponent;
  let fixture: ComponentFixture<OrdermoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdermoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdermoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
