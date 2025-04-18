import { ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-section',
  standalone: false,
  templateUrl: './header-section.component.html',
  styleUrl: './header-section.component.scss'
})
export class HeaderSectionComponent {

  isDropdownOpen = false;
  isMobileMenuOpen = false;  // new property for mobile menu state
  headerHeight: string = '100vh'; // Default value
  isMobileWidth: boolean = false;
  isHomePage: boolean = false;


  activeDropdownItem: string = ''; // Track the active item: 'overview' or 'team'

  private routerSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  goToContact() {
    // 1) Change the fragment in the URL
    this.router.navigate([], { fragment: 'footer' });
    // 2) Scroll to it
    this.viewportScroller.scrollToAnchor('footer');
  }

  // Call this when a dropdown item is clicked.
  setActiveDropdownItem(item: string) {
    this.activeDropdownItem = item;

    localStorage.setItem('activeDropdownItem', item);
  }

  toggleDropdown(event: MouseEvent) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit() {
    this.setHeaderHeight();
    this.checkWidth();


  
    // Subscribe to router events to update isHomePage on every navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/';
  
        // Optionally reset dropdown only when on home page
        if (this.isHomePage) {
          this.activeDropdownItem = '';
          this.isDropdownOpen = false;
          localStorage.removeItem('activeDropdownItem');
        }

        this.setHeaderHeight(); // Update header height based on isHomePage
      }

    });

          // Restore if not on home
          this.isHomePage = this.router.url === '/';
          if (!this.isHomePage) {
            const saved = localStorage.getItem('activeDropdownItem');
            if (saved) {
              this.activeDropdownItem = saved;
            }
        }
  
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    localStorage.removeItem('activeDropdownItem');
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.setHeaderHeight();
    this.checkWidth();
  }

  private setHeaderHeight() {
    this.headerHeight = this.isHomePage ?  window.innerHeight + 'px' : 'auto';
  }

  private checkWidth() {
    // Set flag true if width is 600px or below
    this.isMobileWidth = window.innerWidth <= 600;
  }

  resetDropdown() {
    this.activeDropdownItem = '';
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }

  closedDropdown() {
    //this.activeDropdownItem = '';
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }

}
