import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrls: ['./banner.scss'],
})
export class Banner {
  @Input() text: string = '';
  @Input() styles: { [key: string]: string } = {};
}