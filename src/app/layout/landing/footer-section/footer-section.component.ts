import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-section',
  standalone: false,
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss'
})
export class FooterSectionComponent {

  currentYear: number = new Date().getFullYear();
}
