import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAgentsComponent } from './delivery-agents.component';

describe('DeliveryAgentsComponent', () => {
  let component: DeliveryAgentsComponent;
  let fixture: ComponentFixture<DeliveryAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
