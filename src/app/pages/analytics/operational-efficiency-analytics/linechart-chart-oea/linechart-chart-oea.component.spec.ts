import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinechartChartOEAComponent } from './linechart-chart-oea.component';

describe('LinechartChartOEAComponent', () => {
  let component: LinechartChartOEAComponent;
  let fixture: ComponentFixture<LinechartChartOEAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinechartChartOEAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinechartChartOEAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
