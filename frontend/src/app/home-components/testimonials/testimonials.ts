import { CommonModule } from '@angular/common';
import { Component, ElementRef, viewChild } from '@angular/core';
import { first } from 'rxjs';

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
      name: 'Mr. Potato Head',
      treatment: 'Balance (Rolling) Rehab',
      text: 'I kept rolling off the kitchen counter uncontrollably. It was terrifying. The vestibular therapy helped me find my center of gravity. Now I am a stable, grounded mash.'
    },
    {
      name: 'Brocc O. Lee',
      treatment: 'Steam Anxiety Therapy',
      text: 'I could never hear the water boiling until it was too late. I almost got steamed twice! Thanks to my new hearing aids, I can hear a peeler from three rooms away. Life saver.'
    },
    {
      name: 'Baby Carrot',
      treatment: 'Crunch Articulation',
      text: 'Nobody took me seriously. I was just a snack. After speech therapy, my crunch is articulate and commanding. The Hummus finally respects me.'
    },
    {
      name: 'Tom A. Toe',
      treatment: 'Identity Crisis Counseling',
      text: 'Fruit? Vegetable? I was so confused I couldn’t speak. The team helped me find my voice. Now I scream "I belong in a salad!" with total confidence.'
    },
    {
      name: 'Cornelius Cob',
      treatment: 'Tinnitus (Popping) Management',
      text: 'I had this constant popping sound in my ears, especially when it got hot. Turns out it was just my kernels. The clinic helped me manage the stress before I exploded.'
    },
    {
      name: 'Aubergine',
      treatment: 'Soft Voice Therapy',
      text: 'People always thought I was mushy and quiet. The vocal strengthening exercises gave me firmness and presence. Now I am the star of the Moussaka.'
    }
  ];

  scroll(direction: 'left' | 'right') {
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
