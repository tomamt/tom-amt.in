import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEfficiencyAnalyticsComponent } from './vendor-efficiency-analytics.component';

describe('VendorEfficiencyAnalyticsComponent', () => {
  let component: VendorEfficiencyAnalyticsComponent;
  let fixture: ComponentFixture<VendorEfficiencyAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEfficiencyAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEfficiencyAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
