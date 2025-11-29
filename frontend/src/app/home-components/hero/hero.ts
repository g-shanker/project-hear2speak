import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Carousel } from '../../generic-components/carousel/carousel';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [
        CommonModule,
        Carousel
    ],
    templateUrl: './hero.html',
    styleUrl: './hero.scss',
})

export class Hero {
    heroSlides = [1, 2, 3];
}
