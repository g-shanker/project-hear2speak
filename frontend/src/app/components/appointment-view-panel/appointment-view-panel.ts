import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment-response';

@Component({
  selector: 'app-appointment-view-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-view-panel.html',
  styleUrl: './appointment-view-panel.scss',
})
export class AppointmentViewPanel {
  @Input() appointment: AppointmentResponse | null = null;
}
