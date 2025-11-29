import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq.html',
    styleUrl: './faq.scss',
})

export class Faq {
    openIndex = signal<number | null>(0);

    faqs = [
        {
            question: 'Do I need a doctor’s referral to book an appointment?',
            answer: 'No, you do not need a referral. You can book a consultation directly with us for hearing tests, speech therapy, or balance assessments.'
        },
        {
            question: 'How long does a typical hearing test take?',
            answer: 'A comprehensive diagnostic hearing evaluation typically takes about 30 to 45 minutes.'
        },
        {
            question: 'What should I bring to my first appointment?',
            answer: 'Please bring any previous medical reports, hearing test results, or details of current medications. If the patient is a child, bringing a favorite toy can help them feel more comfortable.'
        },
        {
            question: 'Is parking available at the clinic?',
            answer: 'Yes, there is parking available near the TMR Towers building. Our clinic is located on the 2nd and 3rd floor, above Kotak Mahindra Bank.'
        }
    ];

    toggle(index: number) {
        // If clicking the already open item, close it (null). Otherwise open the new index.
        this.openIndex.update(current => current === index ? null : index);
    }
}
