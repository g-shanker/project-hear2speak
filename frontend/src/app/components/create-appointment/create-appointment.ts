import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment-service';
import { Appointment } from '../../interfaces/appointment-interface';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-appointment.html',
  styleUrl: './create-appointment.scss',
})
export class CreateAppointment {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      patientName: ['', Validators.required],
      patientEmail: ['', Validators.required],
      patientPhone: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointmentData: Appointment = this.appointmentForm.value;
      this.appointmentService.createAppointment(appointmentData)
          .subscribe({
          next: (response) => {
            console.log('Appointment created successfully:', response);
            this.appointmentForm.reset();
          },
          error: (error) => {
            console.error('Error creating appointment:', appointmentData);
          }
        });
    }
  }
}
