import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-section.html',
  styleUrl: './services-section.scss',
})

export class ServicesSection {
    services = [
    {
      title: 'Hearing Aids',
      description: 'Wide selection of modern hearing aids from leading manufacturers. We offer expert fitting, programming, and ongoing support.',
      icon: 'hearing', 
      items: [
        'Comprehensive hearing aid consultation',
        'Digital and analog hearing aids',
        'In-the-ear (ITE) & Behind-the-ear (BTE)',
        'Receiver-in-canal (RIC) options',
        'In-the-canal (ITC) hearing aids',
        'Completely-in-the-canal (CIC) aids',
        'Invisible hearing aids (IIC)',
        'Regular maintenance & adjustments'
      ]
    },
    {
      title: 'Speech & Language Therapy',
      description: 'Personalized therapy for speech, language, and communication disorders for children and adults.',
      icon: 'record_voice_over',
      items: [
        'Speech and Language Assessments',
        'Pediatric Speech & Language Therapy',
        'Speech sound disorders treatment',
        'Language development therapy',
        'Articulation therapy',
        'Stuttering management',
        'Voice therapy',
        'Adult speech rehabilitation'
      ]
    },
    {
      title: 'Diagnostic Services',
      description: 'Comprehensive hearing and vestibular assessments using advanced diagnostic equipment.',
      icon: 'medical_services',
      items: [
        'Pure tone audiometry',
        'Speech audiometry',
        'Impedance audiometry',
        'Otoacoustic emissions (OAE)',
        'Auditory brainstem response (ABR)',
        'Vestibular function tests'
      ]
    },
    {
      title: 'Rehabilitation Programs',
      description: 'Specialized programs to improve hearing ability, speech clarity, and communication skills.',
      icon: 'self_improvement',
      items: [
        'Auditory training',
        'Communication strategies',
        'Balance rehabilitation therapy',
        'Group therapy sessions',
        'Home practice programs'
      ]
    }
  ];
}
