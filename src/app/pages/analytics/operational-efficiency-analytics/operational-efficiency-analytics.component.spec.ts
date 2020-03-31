import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalEfficiencyAnalyticsComponent } from './operational-efficiency-analytics.component';

describe('OperationalEfficiencyAnalyticsComponent', () => {
  let component: OperationalEfficiencyAnalyticsComponent;
  let fixture: ComponentFixture<OperationalEfficiencyAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationalEfficiencyAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalEfficiencyAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
