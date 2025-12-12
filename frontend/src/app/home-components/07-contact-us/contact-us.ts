import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
            label: 'Our Location',
            icon: 'location_on',
            type: 'ADDRESS',
            lines: [
                '2nd and 3rd floor TMR Towers,',
                'Thubarahalli, Whitefield,',
                'Bengaluru, Karnataka 560066'
            ]
        },
        {
            label: 'Phone Number',
            icon: 'phone',
            type: 'PHONE',
            lines: [
                '+91 96207 00649',
                '+91 88845 50923'
            ]
        },
        {
            label: 'Email Address',
            icon: 'email',
            type: 'EMAIL',
            lines: [
                'contact@hear2speak.com',
                'appointments@hear2speak.com'
            ]
        },
        {
            label: 'Working Hours',
            icon: 'schedule',
            type: 'TEXT',
            lines: [
                'Mon - Sat: 9:00 AM - 7:00 PM',
                'Sunday: Closed'
            ]
        }
    ];

    // Helper to strip spaces and dashes for the tel: protocol
    formatPhone(phone: string): string {
        return phone.replace(/[^0-9+]/g, '');
    }
}
