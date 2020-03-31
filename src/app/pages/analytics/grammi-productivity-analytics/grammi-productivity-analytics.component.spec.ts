import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammiProductivityAnalyticsComponent } from './grammi-productivity-analytics.component';

describe('GrammiProductivityAnalyticsComponent', () => {
  let component: GrammiProductivityAnalyticsComponent;
  let fixture: ComponentFixture<GrammiProductivityAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrammiProductivityAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrammiProductivityAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
