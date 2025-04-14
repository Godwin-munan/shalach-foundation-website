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
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.setHeaderHeight();
  }

  private setHeaderHeight() {
    this.headerHeight = window.innerHeight + 'px';
  }
}
