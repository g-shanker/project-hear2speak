import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentEditView } from './appointment-edit-view';

describe('AppointmentEditView', () => {
    let component: AppointmentEditView;
    let fixture: ComponentFixture<AppointmentEditView>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppointmentEditView]
        })
        .compileComponents();
      
        fixture = TestBed.createComponent(AppointmentEditView);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
