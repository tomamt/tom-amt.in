import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedBarChartVIAComponent } from './grouped-bar-chart-via.component';

describe('GroupedBarChartVIAComponent', () => {
  let component: GroupedBarChartVIAComponent;
  let fixture: ComponentFixture<GroupedBarChartVIAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedBarChartVIAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedBarChartVIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
