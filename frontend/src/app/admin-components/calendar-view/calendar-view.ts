import { AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, signal, untracked, viewChild } from '@angular/core';
import { AppointmentViewPanel } from '../../domain-components/appointment-view-panel/appointment-view-panel';
import { trigger, style, animate, transition } from '@angular/animations';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'
import { AppointmentService } from '../../services/appointment-service';
import { CalendarOptions, DateSelectArg, DatesSetArg, EventClickArg, EventDropArg } from '@fullcalendar/core/index.js';
import { mapAppointmentsToEvents } from './calendar-utils';
import { AppointmentSearchRequest } from '../../interfaces/appointment-search-request';
import { AppointmentSearchBar } from '../../domain-components/appointment-search-bar/appointment-search-bar';
import { closestTo, differenceInMinutes, differenceInSeconds, format, isAfter, parseISO } from 'date-fns';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { ClinicianAppointmentRequest } from '../../interfaces/clinician-appointment-request';
import { AppointmentStatus } from '../../interfaces/appointment-status';

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
    animations: [
        trigger('slideInOut', [
            // Slide In (Void -> Enter)
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            // Slide Out (Enter -> Void)
            transition(':leave', [
                animate('250ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})

export class CalendarView implements AfterViewInit, OnDestroy {
    private appointmentService = inject(AppointmentService);
    appointments = this.appointmentService.searchResults;
    selectedAppointment = this.appointmentService.selectedAppointment;
    calendarComponent = viewChild(FullCalendarComponent);

    isCreating = signal(false);
    draftStartTime = signal<string | null>(null);
    draftDurationInMinutes = signal<number>(30);

    private resizeObserver: ResizeObserver | null = null;
    calendarContainer = viewChild<ElementRef>('calendarContainer');

    isSearchJumpPending = signal(false);

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
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },

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

            if(untracked(this.isSearchJumpPending) && rawData.length > 0) {
                this.jumpToBestResult(rawData);
            }
        }, { allowSignalWrites: true });
    }

    ngAfterViewInit(): void {
        const element = this.calendarContainer()?.nativeElement;
        if(element) {
            this.resizeObserver = new ResizeObserver(() => {
                this.calendarComponent()?.getApi()?.updateSize();
            });
            this.resizeObserver.observe(element);
        }
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        this.appointmentService.selectAppointment(null);
        const startStr = format(selectInfo.start, "yyyy-MM-dd'T'HH:mm");
        const duration = differenceInMinutes(selectInfo.end, selectInfo.start);
        this.draftStartTime.set(startStr);
        this.draftDurationInMinutes.set(duration);
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
        this.draftDurationInMinutes.set(30);
    }

    handleEventClick(clickInfo: EventClickArg) {
        this.isCreating.set(false);
        const appointment = clickInfo.event.extendedProps['originalData'];
        this.appointmentService.selectAppointment(appointment);
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
        })
    }

    onSearch(searchRequest: AppointmentSearchRequest) {
        this.isSearchJumpPending.set(true);
        this.appointmentService.searchAppointments(searchRequest);
    }

    private jumpToBestResult(appointments: AppointmentResponse[]) {
        const calendarApi = this.calendarComponent()?.getApi();
        if(!calendarApi) return;

        const now = new Date();
        const dates = appointments.map(a => parseISO(a.startDateTime));
        const futureDates = dates.filter(d => isAfter(d, now));

        let targetDate: Date;

        if(futureDates.length > 0) {
            targetDate = closestTo(now, futureDates)!;
        }

        else {
            targetDate = closestTo(now, dates) || dates[0];
        }

        if(targetDate) {
            calendarApi.gotoDate(targetDate);
            const timeString = format(targetDate, 'HH:mm:ss');
            calendarApi.scrollToTime(timeString);
            // const targetAppointment = appointments.find(a => a.startDateTime === targetDate.toISOString());
        }

        this.isSearchJumpPending.set(false);
    }
}
