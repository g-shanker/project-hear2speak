import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSearchBar } from './appointment-search-bar';

describe('AppointmentSearchBar', () => {
  let component: AppointmentSearchBar;
  let fixture: ComponentFixture<AppointmentSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
