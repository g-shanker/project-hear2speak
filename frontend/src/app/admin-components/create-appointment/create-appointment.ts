import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { AppointmentService } from '../../services/appointment-service';
import { AppointmentForm } from '../../domain-components/appointment-form/appointment-form';

@Component({
    selector: 'app-create-appointment',
    standalone: true,
    imports: [AppointmentForm],
    templateUrl: './create-appointment.html',
    styleUrls: ['./create-appointment.scss'],
})

export class CreateAppointment {
    private appointmentService = inject(AppointmentService);
    formComponent = viewChild(AppointmentForm);
    isSubmitting = signal(false);
    defaultStartTime = input<string | null>(null);

    created = output<void>();
    cancel = output<void>();

    onCreate(): void {
        const formState = this.formComponent();
        if (!formState) return;

        const payload = formState.getClinicianPayload();

        if (payload) {
            this.isSubmitting.set(true);
            this.appointmentService.createAppointment(payload).subscribe({
                next: (createdAppointment) => {
                    console.log('Created clinician appointment successfully:', createdAppointment);
                    this.isSubmitting.set(false);
                    formState.reset();
                    this.created.emit();
                },
                error: (err) => {
                    console.error('Error while creating clinician appointment:', err);
                    this.isSubmitting.set(false);
                }
            });
        }
    }

}
