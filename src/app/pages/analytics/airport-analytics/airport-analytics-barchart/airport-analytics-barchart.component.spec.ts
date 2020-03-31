import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportAnalyticsBarchartComponent } from './airport-analytics-barchart.component';

describe('AirportAnalyticsBarchartComponent', () => {
  let component: AirportAnalyticsBarchartComponent;
  let fixture: ComponentFixture<AirportAnalyticsBarchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportAnalyticsBarchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportAnalyticsBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
