import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAppointment } from './request-appointment';

describe('RequestAppointment', () => {
  let component: RequestAppointment;
  let fixture: ComponentFixture<RequestAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
