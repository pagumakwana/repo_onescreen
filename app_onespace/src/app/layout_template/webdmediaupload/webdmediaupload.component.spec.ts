import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebdmediauploadComponent } from './webdmediaupload.component';

describe('WebdmediauploadComponent', () => {
  let component: WebdmediauploadComponent;
  let fixture: ComponentFixture<WebdmediauploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebdmediauploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebdmediauploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
