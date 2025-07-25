import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebdtableComponent } from './webdtable.component';

describe('WebdtableComponent', () => {
  let component: WebdtableComponent;
  let fixture: ComponentFixture<WebdtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebdtableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebdtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
