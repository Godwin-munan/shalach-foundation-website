import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer-section',
  standalone: false,
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss'
})
export class FooterSectionComponent {

  currentYear: number = new Date().getFullYear();
  isHomePage: boolean = false;

    private routerSubscription: Subscription | undefined;
  
    constructor(private router: Router) {}

    ngOnInit() {
    
      // Subscribe to router events to update isHomePage on every navigation
      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isHomePage = event.urlAfterRedirects === '/';
    
        }
      });
    
      // Also check the current route immediately on init
      this.isHomePage = this.router.url === '/';
    }
  
    ngOnDestroy() {
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }

}
