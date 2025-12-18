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
            question: 'Do I need a doctor\'s referral to book an appointment?',
            answer: 'No, you do not need a referral. You can book a consultation directly with us for hearing tests, speech therapy, or balance assessments.'
        },
        {
            question: 'How long does a typical session take?',
            answer: 'A comprehensive diagnostic hearing evaluation and most speech therapy sessions last between 30-40 minutes each, depending on the individual\'s needs and age. For children, sessions might be shorter to accommodate their attention span. The frequency of sessions is personalized based on your therapist\'s recommendation and can range from once a week to several times a week.'
        },
        {
            question: 'What should I bring to my first appointment?',
            answer: 'Please bring any previous medical reports, hearing test results, or details of current medications. If the patient is a child, bringing a favorite toy can help them feel more comfortable.'
        },
        {
            question: 'Is parking available at the clinic?',
            answer: 'Yes, there is parking available near the TMR Towers building. Our clinic is located on the 2nd and 3rd floor, above Kotak Mahindra Bank.'
        },
        {
            question: 'What should I expect during my first appointment?',
            answer: 'During your first appointment, we will conduct a thorough assessment based on your specific needs. For hearing concerns, this typically involves a comprehensive hearing evaluation. For speech or language concerns, we\'ll perform an initial assessment to understand your specific challenges. We\'ll discuss your medical history, current symptoms, and goals for treatment. At the end of the appointment, we\'ll explain our findings and recommend a personalized treatment plan.'
        },
        {
            question: 'How often do hearing aids need to be replaced?',
            answer: 'On average, hearing aids last about 5-7 years. However, this can vary depending on the model, how well they\'re maintained, and technological advancements. Regular maintenance can extend their lifespan. We recommend annual checkups to ensure your hearing aids are functioning optimally and meeting your hearing needs.'
        },
        {
            question: 'Can hearing loss be prevented?',
            answer: 'While some causes of hearing loss cannot be prevented (such as genetic factors or aging), noise-induced hearing loss can be prevented by protecting your ears from loud sounds. We recommend using ear protection in noisy environments, keeping volume at a reasonable level when using headphones, and getting regular hearing check-ups to monitor your hearing health.'
        },
        {
            question: 'How do I know if my child needs speech therapy?',
            answer: 'Signs that may indicate your child could benefit from speech therapy include: not babbling by 9 months, not speaking first words by 15 months, not combining words by 24 months, difficult-to-understand speech after age 3, stuttering that persists for more than 6 months, or difficulty following directions. If you\'re concerned about your child\'s speech or language development, we recommend scheduling an evaluation with our speech-language pathologists.'
        }
    ];

    toggle(index: number): void {
        // If clicking the already open item, close it (null). Otherwise open the new index.
        this.openIndex.update(current => current === index ? null : index);
    }
}
