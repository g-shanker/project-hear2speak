import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { AppointmentViewPanel } from '../../domain-components/appointment-view-panel/appointment-view-panel';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'
import { AppointmentService } from '../../services/appointment-service';
import { CalendarOptions, DateSelectArg, DatesSetArg, EventClickArg, EventDropArg } from '@fullcalendar/core/index.js';
import { mapAppointmentsToEvents } from './calendar-utils';
import { AppointmentSearchRequest } from '../../interfaces/appointment-search-request';
import { AppointmentSearchBar } from '../../domain-components/appointment-search-bar/appointment-search-bar';
import { differenceInSeconds, format } from 'date-fns';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { ClinicianAppointmentRequest } from '../../interfaces/clinician-appointment-request';
import { AppointmentStatus } from '../../interfaces/appointment-status';

import { trigger, transition, style, animate } from '@angular/animations';
import { CreateAppointment } from '../create-appointment/create-appointment';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [
        FullCalendarModule,
        AppointmentSearchBar,
        AppointmentViewPanel,
        CreateAppointment
    ],
    templateUrl: './calendar-view.html',
    styleUrls: ['./calendar-view.scss'],
})

export class CalendarView {
    private appointmentService = inject(AppointmentService);
    appointments = this.appointmentService.searchResults;
    selectedAppointment = this.appointmentService.selectedAppointment;
    calendarComponent = viewChild(FullCalendarComponent);

    isCreating = signal(false);
    draftStartTime = signal<string | null>(null);

    calendarOptions = signal<CalendarOptions>({
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        unselectAuto: false,
        events: [],
        slotMinTime: '09:00:00',
        slotMaxTime: '18:00:00',
        scrollTime: '09:00:00',
        slotDuration: '00:15:00',
        slotLabelInterval: '01:00',
        allDaySlot: false,
        height: '100%',

        select: (arg) => this.handleDateSelect(arg),

        eventClick: (arg) => this.handleEventClick(arg),
        datesSet: (arg) => this.handleDateRangeChange(arg),

        eventDrop: (arg) => this.handleReschedule(arg),
        eventResize: (arg) => this.handleReschedule(arg)
    });

    constructor() {
        effect(() => {
            const rawData = this.appointments();
            const mappedEvents = mapAppointmentsToEvents(rawData);
            this.calendarOptions.update(options => ({
                ...options,
                events: mappedEvents
            }));
        });
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        this.appointmentService.selectAppointment(null);
        const startStr = format(selectInfo.start, "yyyy-MM-dd'T'HH:mm");
        this.draftStartTime.set(startStr);
        this.isCreating.set(true);
    }

    onSearchCreateSuccess() {
        this.closePanel()
        this.calendarComponent()?.getApi().unselect();
    }

    closePanel() {
        this.appointmentService.selectAppointment(null);
        this.isCreating.set(false);
        this.draftStartTime.set(null);
        setTimeout(() => {
            this.calendarComponent()?.getApi()?.updateSize();
        }, 5);
    }

    handleEventClick(clickInfo: EventClickArg) {
        this.isCreating.set(false);
        const appointment = clickInfo.event.extendedProps['originalData'];
        this.appointmentService.selectAppointment(appointment);
        setTimeout(() => {
            this.calendarComponent()?.getApi()?.updateSize();
        }, 5);
    }

    handleReschedule(arg: EventDropArg | EventResizeDoneArg) {
        const event = arg.event;
        const originalAppointment: AppointmentResponse = event.extendedProps['originalData'];

        if(!event.start || !event.end) {
            arg.revert();
            return;
        }

        const payload: ClinicianAppointmentRequest = {
            patientFullName: originalAppointment.patientFullName,
            patientEmail: originalAppointment.patientEmail,
            patientPhoneNumber: originalAppointment.patientPhoneNumber,
            patientReason: originalAppointment.patientReason,
            appointmentStatus: originalAppointment.appointmentStatus as AppointmentStatus,
            clinicianNotes: originalAppointment.clinicianNotes,
            isAcknowledged: originalAppointment.isAcknowledged,

            startDateTime: format(event.start, "yyyy-MM-dd'T'HH:mm:ss"),
            durationInSeconds: differenceInSeconds(event.end, event.start)
        };

        this.appointmentService.updateAppointment(originalAppointment.id, payload).subscribe({
            next: (updatedAppointment) => {
                console.log('Rescheduled successfully');
            },  
            error: (err) => {
                console.error('Reschedule failed:', err);
                arg.revert();
            }
        });
    }

    handleDateRangeChange(dateInfo: DatesSetArg) {
        this.appointmentService.searchAppointments({
            startDateFrom: format(dateInfo.start, "yyyy-MM-dd'T'HH:mm:ss"),
            startDateTo: format(dateInfo.end, "yyyy-MM-dd'T'HH:mm:ss"),
            globalText: null,
            appointmentStatus: null,
            sortField: 'startDateTime',
            ascending: true
        })
    }

    onSearch(searchRequest: AppointmentSearchRequest) {
        this.appointmentService.searchAppointments(searchRequest);
    }
}
