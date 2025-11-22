import { Component } from '@angular/core';
import { Slicer } from '../../generic-components/slicer/slicer';
import { Dashboards } from '../../admin-components/dashboards/dashboards';
import { CalendarView } from '../../admin-components/calendar-view/calendar-view';
import { SlicerItem } from '../../generic-components/slicer/slicer-item.interface';
import { FindAppointment } from '../../admin-components/find-appointment/find-appointment';
import { CreateAppointment } from '../../admin-components/create-appointment/create-appointment';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [Slicer],
    templateUrl: './admin.html',
    styleUrls: ['./admin.scss'],
})

export class Admin {
    slicerItems: SlicerItem[] = [
        {
            title: 'Find Appointment',
            icon: 'search',
            component: FindAppointment,
        },
        {
            title: 'Create Appointment',
            icon: 'add',
            component: CreateAppointment,
        },
        {
            title: 'Calendar View',
            icon: 'calendar_month',
            component: CalendarView
        },
        {
            title: 'Dashboards',
            icon: 'analytics',
            component: Dashboards
        }
    ]
}
