import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorymoduleComponent } from './categorymodule.component';

describe('CategorymoduleComponent', () => {
  let component: CategorymoduleComponent;
  let fixture: ComponentFixture<CategorymoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorymoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorymoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
