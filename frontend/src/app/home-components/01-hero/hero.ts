import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

    one = 'assets/images/hero-images/one.jpg'
    two = 'assets/images/hero-images/two.jpg'
    three = 'assets/images/hero-images/three.jpg'
    four = 'assets/images/hero-images/four.jpg'
    five = 'assets/images/hero-images/five.jpg'

    heroSlides = [
        this.one,
        this.two,
        this.three,
        this.four,
        this.five
    ];
}
