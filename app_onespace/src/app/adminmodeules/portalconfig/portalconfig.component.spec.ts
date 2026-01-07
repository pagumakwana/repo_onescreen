import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalconfigComponent } from './portalconfig.component';

describe('PortalconfigComponent', () => {
  let component: PortalconfigComponent;
  let fixture: ComponentFixture<PortalconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalconfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
