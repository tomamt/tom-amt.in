import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInformationAnalyticsComponent } from './vendor-information-analytics.component';

describe('VendorInformationAnalyticsComponent', () => {
  let component: VendorInformationAnalyticsComponent;
  let fixture: ComponentFixture<VendorInformationAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorInformationAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorInformationAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
