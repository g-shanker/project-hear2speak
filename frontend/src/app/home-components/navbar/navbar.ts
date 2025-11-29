import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})

export class Navbar {
    isMenuOpen = signal(false);
    isScrolled = signal(false);
    
    navbarLinks = [
        { label: 'Home', section: '#hero' },
        { label: 'Services', section: '#services' },
        { label: 'About Us', section: '#about' },
        { label: 'FAQs', section: '#faq' },
        { label: 'Contact Us', section: '#contact' }
    ]

    toggleMenu() {
        this.isMenuOpen.update(value => !value);
    }

    closeMenu() {
        this.isMenuOpen.set(false);
    }

    @HostListener('window:scroll') 
    onWindowScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        this.isScrolled.set(scrollPosition > 0);
    }
}
