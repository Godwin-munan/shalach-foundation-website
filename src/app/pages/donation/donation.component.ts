import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation',
  standalone: false,
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss'
})
export class DonationComponent {
  selectedAmount: number | null = null;
  customAmount: string = '';
  donationType: 'one-time' | 'monthly' = 'one-time';

  predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  constructor(private router: Router) {}

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount = '';
  }

  onCustomAmountChange(): void {
    if (this.customAmount) {
      this.selectedAmount = null;
    }
  }

  setDonationType(type: 'one-time' | 'monthly'): void {
    this.donationType = type;
  }

  proceedToDonate(): void {
    const amount = this.customAmount || this.selectedAmount;
    if (amount) {
      console.log(`Proceeding with ${this.donationType} donation of $${amount}`);
      // Implementation for payment processing would go here
    }
  }

  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }
}
