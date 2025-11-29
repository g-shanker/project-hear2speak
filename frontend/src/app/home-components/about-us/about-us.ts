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
    aboutSlides = [1, 2, 3];
}
