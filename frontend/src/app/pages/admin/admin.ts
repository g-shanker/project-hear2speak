import { Component } from '@angular/core';
import { Banner } from '../../components/banner/banner';
import { Slicer } from '../../components/slicer/slicer';
import { SlicerItem } from '../../components/slicer/slicer-item.interface';
import { CreateAppointment } from '../../components/create-appointment/create-appointment';
import { FindAppointment } from '../../components/find-appointment/find-appointment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [Banner, Slicer],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage {

  bannerText: string = 'Project - Hear2Speak';
  bannerStyles: { [key: string]: string } = {
    'background-color': '#1976d2',
    'color': 'white',
    'font-weight': 'bold',
  };

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
    }
  ]
}
