import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeAndCancellationPolicyComponent } from './dispute-and-cancellation-policy.component';

describe('DisputeAndCancellationPolicyComponent', () => {
  let component: DisputeAndCancellationPolicyComponent;
  let fixture: ComponentFixture<DisputeAndCancellationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeAndCancellationPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeAndCancellationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
