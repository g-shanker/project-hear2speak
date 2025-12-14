import { AppointmentService } from '../../services/component/appointment-service';
import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { AppointmentForm, FormMode } from '../../domain-components/appointment-form/appointment-form';
import { AppointmentStatus } from '../../interfaces/appointment/appointment-status';
import { ToastService } from '../../services/component/toast-service';

@Component({
    selector: 'app-create-appointment',
    standalone: true,
    imports: [AppointmentForm],
    templateUrl: './create-appointment.html',
    styleUrls: ['./create-appointment.scss'],
})

export class CreateAppointment {
    private appointmentService = inject(AppointmentService);
    private toast = inject(ToastService);

    formComponent = viewChild(AppointmentForm);
    isSubmitting = signal(false);

    mode = 'CLINICIAN' as FormMode;
    defaultStartTime = input<string>('');
    defaultDurationInMinutes = input<number>(45);
    defaultAppointmentStatus = input<AppointmentStatus>('SCHEDULED' as AppointmentStatus);

    created = output<void>();
    cancel = output<void>();

    onCreate(): void {
        const formState = this.formComponent();
        if (!formState) return;

        const payload = formState.getFormContents();

        if (payload) {
            this.isSubmitting.set(true);
            this.appointmentService.createAppointment(payload).subscribe({
                next: (createdAppointment) => {
                    console.log('Created appointment successfully:', createdAppointment);
                    this.toast.show('Created appointment successfully!', 'success');
                    this.isSubmitting.set(false);
                    formState.reset();
                    this.created.emit();
                },
                error: (err) => {
                    console.error('Error while creating appointment:', err);
                    this.toast.show('Error while creating appointment.', 'error');
                    this.isSubmitting.set(false);
                }
            });
        }
    }

}
