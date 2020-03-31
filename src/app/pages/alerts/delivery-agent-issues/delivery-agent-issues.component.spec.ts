import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAgentIssuesComponent } from './delivery-agent-issues.component';

describe('DeliveryAgentIssuesComponent', () => {
  let component: DeliveryAgentIssuesComponent;
  let fixture: ComponentFixture<DeliveryAgentIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryAgentIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAgentIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
