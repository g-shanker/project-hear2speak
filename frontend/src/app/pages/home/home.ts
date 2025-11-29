import { Component } from '@angular/core';
import { Navbar } from '../../home-components/navbar/navbar';
import { Hero } from '../../home-components/hero/hero';
import { RequestAppointment } from '../../home-components/request-appointment/request-appointment';
import { ServicesSection } from '../../home-components/services-section/services-section';
import { AboutUs } from '../../home-components/about-us/about-us';
import { Faq } from '../../home-components/faq/faq';
import { ContactUs } from '../../home-components/contact-us/contact-us';
import { Footer } from '../../home-components/footer/footer';
import { Testimonials } from '../../home-components/testimonials/testimonials';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        Navbar,
        Hero,
        RequestAppointment,
        ServicesSection,
        AboutUs,
        Testimonials,
        Faq,
        ContactUs,
        Footer
    ],
    templateUrl: './home.html',
    styleUrls: ['./home.scss'],
})

export class Home {

}
