import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportAnalyticsComponent } from './airport-analytics.component';

describe('AirportAnalyticsComponent', () => {
  let component: AirportAnalyticsComponent;
  let fixture: ComponentFixture<AirportAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
