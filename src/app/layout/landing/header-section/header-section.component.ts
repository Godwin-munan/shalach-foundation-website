import { Component, HostListener } from '@angular/core';

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
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.setHeaderHeight();
    this.checkWidth();
  }

  private setHeaderHeight() {
    this.headerHeight = window.innerHeight + 'px';
  }

  private checkWidth() {
    // Set flag true if width is 600px or below
    this.isMobileWidth = window.innerWidth <= 600;
  }
}
