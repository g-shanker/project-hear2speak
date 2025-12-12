import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

    one = 'assets/images/about-us-images/one.jpg'
    two = 'assets/images/about-us-images/two.jpg'
    three = 'assets/images/about-us-images/three.jpg'
    four = 'assets/images/about-us-images/four.jpg'
    five = 'assets/images/about-us-images/five.jpg'
    six = 'assets/images/about-us-images/six.jpg'

    aboutSlides = [
        this.one,
        this.two,
        this.three,
        this.four,
        this.five,
        this.six
    ];
}
