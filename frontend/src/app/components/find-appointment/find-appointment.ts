import { Component, OnInit } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { AppointmentService } from '../../services/appointment-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-find-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-appointment.html',
  styleUrl: './find-appointment.scss',
})
export class FindAppointment implements OnInit {

  appointments: AppointmentResponse[] = [];
  selectedAppointment: AppointmentResponse | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getAllAppointments().subscribe({
      next: (data: AppointmentResponse[]) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching appointments:', error);
        this.errorMessage = 'Failed to load appointments. Please try again later.';
        this.isLoading = false;
      }
    })
  }

  selectAppointment(appointment: any) {
    this.selectedAppointment = appointment;
  }


}
