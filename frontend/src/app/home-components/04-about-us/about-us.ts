import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from '../../generic-components/carousel/carousel';

@Component({
    selector: 'app-about-us',
    standalone: true,
    imports: [
        CommonModule,
        Carousel
    ],
    templateUrl: './about-us.html',
    styleUrl: './about-us.scss',
})
export class AboutUs {

    one = 'assets/images/about-us-images/one.png';
    two = 'assets/images/about-us-images/two.jpg';
    three = 'assets/images/about-us-images/three.png';
    four = 'assets/images/about-us-images/four.png';

    aboutSlides = [
        this.one,
        this.two,
        this.three,
        this.four
    ];
}
