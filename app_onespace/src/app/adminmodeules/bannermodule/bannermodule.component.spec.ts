import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannermoduleComponent } from './bannermodule.component';

describe('BannermoduleComponent', () => {
  let component: BannermoduleComponent;
  let fixture: ComponentFixture<BannermoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannermoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannermoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
