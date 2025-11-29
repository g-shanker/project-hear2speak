import { CommonModule } from '@angular/common';
import { Component, contentChild, input, signal, TemplateRef, inject, DestroyRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})

export class Carousel<T> {
    items = input.required<T[]>();
    autoPlay = input(true);
    interval = input(5000);
    showDots = input(true);
    showArrows = input(false);
    itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');
    activeIndex = signal(0);
    private timerId: any;
    private destroyRef = inject(DestroyRef);

    constructor() {
        if(this.autoPlay()) this.startTimer();
        this.destroyRef.onDestroy(() => this.stopTimer());
    }

    next() {
        const length = this.items().length;
        this.activeIndex.update(i => (i + 1) % length);
    }

    prev() {
        const length = this.items().length;
        this.activeIndex.update(i => (i - 1 + length) % length);
    }

    goTo(index: number) {
        this.activeIndex.set(index);
        this.resetTimer();
    }

    startTimer() {
        if(this.autoPlay()) {
            this.timerId = setInterval(() => this.next(), this.interval());
        }
    }

    stopTimer() {
        if(this.timerId) clearInterval(this.timerId);
    }

    resetTimer() {
        this.stopTimer();
        this.startTimer();
    }

}
