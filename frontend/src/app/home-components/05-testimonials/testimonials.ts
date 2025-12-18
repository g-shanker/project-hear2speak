import { CommonModule } from '@angular/common';
import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {

    scroller = viewChild<ElementRef>('scroller')

    reviews = [
    {
      name: 'Ankit Verma',
      treatment: 'Speech Therapy',
      text: 'Taking my kid here for couple of year and I must admin there is significant improvement in my kid\'s growth. I Sincerely thanks Pragati mam for all the sessions & guidance in making my kid achieve his age milestones. I strongly recommend this place for Speech therapy.'
    },
    {
      name: 'Pavan Kumar',
      treatment: 'Speech Therapy',
      text: 'Our prediatrician has enquired and suggested us this theraphy center, as my child wasn\'t talking even after two and half years age though going to pre-school. We felt that it\'s a good decision and my child has been improved a lot in last 4 months. We\'re thankful for the therapists Ambika and Pragati.'
    },
    {
      name: 'Sukanya Lakshmi',
      treatment: 'Speech Therapy',
      text: 'The approach was always professional, yet compassionate, making the entire journey feel comfortable and positive. I highly recommend Hear2Speak Clinic to anyone looking for effective, evidence-based speech therapy. A big thank you to Pragathi Ma\'am and the team for their wonderful support'
    },
    {
      name: 'Saheer Anaesthesia',
      treatment: 'Speech Therapy',
      text: 'Nice reception..Good technicians and friendly understanding staffs..Neat and tidy...with modern equipments...'
    }
  ];

  scroll(direction: 'left' | 'right'): void {
    const element = this.scroller()?.nativeElement;
    if(!element) return;

    const firstCard = element.querySelector('.review-item') as HTMLElement;
    if(!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const style = getComputedStyle(element);
    const gap = parseFloat(style.columnGap) || 0;

    const scrollAmount = cardWidth + gap;

    element.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
    });
  }
}
