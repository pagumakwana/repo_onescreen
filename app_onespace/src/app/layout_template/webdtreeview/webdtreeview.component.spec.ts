import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebdtreeviewComponent } from './webdtreeview.component';

describe('WebdtreeviewComponent', () => {
  let component: WebdtreeviewComponent;
  let fixture: ComponentFixture<WebdtreeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebdtreeviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebdtreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
