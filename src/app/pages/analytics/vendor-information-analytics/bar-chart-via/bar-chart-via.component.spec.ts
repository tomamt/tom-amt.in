import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartVIAComponent } from './bar-chart-via.component';

describe('BarChartVIAComponent', () => {
  let component: BarChartVIAComponent;
  let fixture: ComponentFixture<BarChartVIAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartVIAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartVIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
