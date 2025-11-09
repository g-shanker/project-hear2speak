import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSummaryPanel } from './appointment-summary-panel';

describe('AppointmentSummaryPanel', () => {
  let component: AppointmentSummaryPanel;
  let fixture: ComponentFixture<AppointmentSummaryPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSummaryPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSummaryPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
