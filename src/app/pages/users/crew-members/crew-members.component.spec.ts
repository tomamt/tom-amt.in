import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewMembersComponent } from './crew-members.component';

describe('CrewMembersComponent', () => {
  let component: CrewMembersComponent;
  let fixture: ComponentFixture<CrewMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrewMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
