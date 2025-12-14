import { EventInput } from '@fullcalendar/core';
import { addSeconds, format, parse, parseISO } from 'date-fns';
import { AppointmentResponse } from "../../interfaces/appointment/appointment-response";

export function mapAppointmentsToEvents(appointments: AppointmentResponse[]): EventInput[] {
    return appointments.map(appointment => {
        const startDateTime = parseISO(appointment.startDateTime);
        const endDateTime = addSeconds(startDateTime, appointment.durationInSeconds);

        return {
            id: appointment.id.toString(),
            title: appointment.patientFullName,
            start: appointment.startDateTime,
            end: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
            classNames: [`evt-${appointment.appointmentStatus.toLowerCase()}`],
            extendedProps: {
                originalData: appointment
            }
        };
    });
}