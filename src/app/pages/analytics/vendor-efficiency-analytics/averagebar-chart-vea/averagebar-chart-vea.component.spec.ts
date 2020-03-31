import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AveragebarChartVEAComponent } from './averagebar-chart-vea.component';

describe('GroupedbarChartVEAComponent', () => {
  let component: AveragebarChartVEAComponent;
  let fixture: ComponentFixture<AveragebarChartVEAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AveragebarChartVEAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AveragebarChartVEAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
