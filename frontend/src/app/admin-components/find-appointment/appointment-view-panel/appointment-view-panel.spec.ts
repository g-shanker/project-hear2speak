import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentViewPanel } from './appointment-view-panel';

describe('AppointmentViewPanel', () => {
    let component: AppointmentViewPanel;
    let fixture: ComponentFixture<AppointmentViewPanel>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [AppointmentViewPanel]
        })
        .compileComponents();

        fixture = TestBed.createComponent(AppointmentViewPanel);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
