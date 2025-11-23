import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
    label = input.required<string>();
    value = input.required<number | string>();
    icon = input<string>('analytics');
    color = input<string>('#2196f3');
}
