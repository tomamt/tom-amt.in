import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AveragebarChartGPAComponent } from './averagebar-chart-gpa.component';



describe('AveragebarChartGPAComponent', () => {
  let component: AveragebarChartGPAComponent;
  let fixture: ComponentFixture<AveragebarChartGPAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AveragebarChartGPAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AveragebarChartGPAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
