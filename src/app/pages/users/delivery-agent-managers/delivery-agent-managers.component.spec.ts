import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAgentManagersComponent } from './delivery-agent-managers.component';

describe('DeliveryAgentManagersComponent', () => {
  let component: DeliveryAgentManagersComponent;
  let fixture: ComponentFixture<DeliveryAgentManagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryAgentManagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAgentManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
