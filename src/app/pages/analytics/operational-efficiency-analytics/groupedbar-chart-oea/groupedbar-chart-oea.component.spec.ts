import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedbarChartOEAComponent } from './groupedbar-chart-oea.component';

describe('GroupedbarChartOEAComponent', () => {
  let component: GroupedbarChartOEAComponent;
  let fixture: ComponentFixture<GroupedbarChartOEAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedbarChartOEAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedbarChartOEAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
