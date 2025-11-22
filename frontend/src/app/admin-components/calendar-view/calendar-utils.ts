import { EventInput } from '@fullcalendar/core';
import { addSeconds, format, parse, parseISO } from 'date-fns';
import { AppointmentResponse } from "../../interfaces/appointment-response";

export function mapAppointmentsToEvents(appointments: AppointmentResponse[]): EventInput[] {
    return appointments.map(appointment => {
        const startDateTime = parseISO(appointment.startDateTime);
        const endDateTime = addSeconds(startDateTime, appointment.durationInSeconds);

        return {
            id: appointment.id.toString(),
            title: appointment.patientFullName,
            start: appointment.startDateTime,
            end: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
            backgroundColor: getStatusColor(appointment.appointmentStatus),
            borderColor: 'transparent',
            extendedProps: {
                originalData: appointment
            }
        };
    });
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'COMPLETED': return '#4caf50'; // Green
        case 'CANCELED': return '#f44336';  // Red
        case 'SCHEDULED': return '#2196f3'; // Blue
        default: return '#9e9e9e';          // Grey
    }
}