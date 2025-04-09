import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header-section',
  standalone: false,
  templateUrl: './header-section.component.html',
  styleUrl: './header-section.component.scss'
})
export class HeaderSectionComponent {

  isDropdownOpen = false;
  headerHeight: string = '100vh'; // Default value

  toggleDropdown(event: MouseEvent) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
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
