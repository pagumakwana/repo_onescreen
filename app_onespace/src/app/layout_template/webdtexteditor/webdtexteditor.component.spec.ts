import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebdtexteditorComponent } from './webdtexteditor.component';

describe('WebdtexteditorComponent', () => {
  let component: WebdtexteditorComponent;
  let fixture: ComponentFixture<WebdtexteditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebdtexteditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebdtexteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
