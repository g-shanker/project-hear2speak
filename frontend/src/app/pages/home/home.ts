import { Component } from '@angular/core';
import { Navbar } from '../../home-components/00-navbar/navbar';
import { Hero } from '../../home-components/01-hero/hero';
import { RequestAppointment } from '../../home-components/02-request-appointment/request-appointment';
import { ServicesSection } from '../../home-components/03-services/services-section';
import { AboutUs } from '../../home-components/04-about-us/about-us';
import { Testimonials } from '../../home-components/05-testimonials/testimonials';
import { Faq } from '../../home-components/06-faq/faq';
import { ContactUs } from '../../home-components/07-contact-us/contact-us';
import { Footer } from '../../home-components/08-footer/footer';

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
