import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenbookingComponent } from './screenbooking.component';

describe('ScreenbookingComponent', () => {
  let component: ScreenbookingComponent;
  let fixture: ComponentFixture<ScreenbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenbookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
