import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAgentUnavailableComponent } from './delivery-agent-da-unavailable.component';

describe('DeliveryAgentUnavailableComponent', () => {
  let component: DeliveryAgentUnavailableComponent;
  let fixture: ComponentFixture<DeliveryAgentUnavailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryAgentUnavailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAgentUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
