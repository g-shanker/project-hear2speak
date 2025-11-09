import { Component, OnInit } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { AppointmentService } from '../../services/appointment-service';
import { CommonModule } from '@angular/common';
import { AppointmentSearchBar } from '../appointment-search-bar/appointment-search-bar';
import { AppointmentSummaryPanel } from '../appointment-summary-panel/appointment-summary-panel';
import { AppointmentViewPanel } from '../appointment-view-panel/appointment-view-panel';

@Component({
  selector: 'app-find-appointment',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentSearchBar,
    AppointmentSummaryPanel,
    AppointmentViewPanel
  ],
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
    setTimeout(() => {
      this.loadAppointments();
    }, 1000);
    // this.loadAppointments();
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

  onAppointmentSelected(appointment: AppointmentResponse): void {
    this.selectedAppointment = appointment;
  }

}
