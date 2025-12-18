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

    one = 'assets/images/hero-images/one.png';
    two = 'assets/images/hero-images/two.png';
    three = 'assets/images/hero-images/three.png';

    heroSlides = [
        this.one,
        this.two,
        this.three
    ];
}
