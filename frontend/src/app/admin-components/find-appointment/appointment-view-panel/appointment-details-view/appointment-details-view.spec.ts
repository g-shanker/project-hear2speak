import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailsView } from './appointment-details-view';

describe('AppointmentDetailsView', () => {
    let component: AppointmentDetailsView;
    let fixture: ComponentFixture<AppointmentDetailsView>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppointmentDetailsView]
        })
        .compileComponents();
      
        fixture = TestBed.createComponent(AppointmentDetailsView);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
