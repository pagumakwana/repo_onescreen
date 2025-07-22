import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeModuleComponent } from './home-module.component';

describe('HomeModuleComponent', () => {
  let component: HomeModuleComponent;
  let fixture: ComponentFixture<HomeModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
