import { Component } from '@angular/core';
import { Slicer } from '../../components/slicer/slicer';
import { SlicerItem } from '../../components/slicer/slicer-item.interface';
import { Overview } from '../../components/overview/overview';
import { Calendar } from '../../components/calendar/calendar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [Slicer],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage {
  slicerItems: SlicerItem[] = [
    {
      title: 'Overview',
      icon: 'dashboard',
      component: Overview,
    },
    {
      title: 'Calendar',
      icon: 'calendar_month',
      component: Calendar,
    }
  ]
}
