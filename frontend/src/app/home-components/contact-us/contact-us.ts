import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss',
})
export class ContactUs {
    contactInfo = [
    {
      icon: 'location_on',
      label: 'Address',
      lines: [
        '2nd and 3rd floor TMR Towers,',
        'Thubarahalli, Above Kotak Mahindra Bank',
        'Bengaluru, Karnataka'
      ]
    },
    {
      icon: 'phone',
      label: 'Phone',
      lines: [
        '+91 96207 00649',
        '+91 88845 50923'
      ],
      isLink: true // Helper to style phone numbers as links
    },
    {
      icon: 'email',
      label: 'Email',
      lines: [
        'hear2speakbalance@gmail.com'
      ],
      isLink: true
    },
    {
      icon: 'schedule',
      label: 'Working Hours',
      lines: [
        'Mon - Fri: 9:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 3:00 PM',
        'Sunday: Closed'
      ]
    }
  ];
}
