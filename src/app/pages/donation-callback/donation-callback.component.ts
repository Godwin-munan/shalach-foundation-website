import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService } from '../../services/donation.service';
import { IDonationStatus } from '../../models/i-donation-status';

@Component({
  selector: 'app-donation-callback',
  standalone: false,
  templateUrl: './donation-callback.component.html',
  styleUrl: './donation-callback.component.scss'
})
export class DonationCallbackComponent {
  loading = true;
  paymentStatus: 'checking' | 'success' | 'failed' | 'timeout' = 'checking';
  donationDetails: any = null;
  errorMessage: string = '';
  reference: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    // Get reference from URL query params or sessionStorage
    this.reference = this.route.snapshot.queryParamMap.get('reference') ||
                     sessionStorage.getItem('donation_reference') || '';

    if (!this.reference) {
      this.paymentStatus = 'failed';
      this.errorMessage = 'Invalid payment reference';
      this.loading = false;
      return;
    }

    // Clear stored reference
    sessionStorage.removeItem('donation_reference');

    // Start polling for payment status
    this.verifyPayment(this.reference);
  }

  verifyPayment(reference: string): void {
    this.donationService.pollPaymentStatus(reference, 60) // Poll for up to 2 minutes
      .subscribe({
        next: (response: IDonationStatus) => {
          if (response.success && response.data) {
            const status = response.data.status;

            if (status === 'success') {
              this.paymentStatus = 'success';
              this.donationDetails = response.data;
              this.loading = false;

              // Optional: Track conversion for analytics
              this.trackDonationSuccess(response.data);
            } else if (status === 'failed') {
              this.paymentStatus = 'failed';
              this.errorMessage = 'Payment was not successful';
              this.loading = false;
            } else if (status === 'abandoned') {
              this.paymentStatus = 'failed';
              this.errorMessage = 'Payment was abandoned';
              this.loading = false;
            }
            // If still pending, polling continues automatically
          }
        },
        error: (err) => {
          console.error('Payment verification error:', err);
          this.paymentStatus = 'timeout';
          this.errorMessage = 'Unable to verify payment. Please contact support with reference: ' + reference;
          this.loading = false;
        },
        complete: () => {
          // Polling completed (either success or max attempts reached)
          if (this.loading) {
            this.paymentStatus = 'timeout';
            this.errorMessage = 'Payment verification timeout. Please check your email or contact support.';
            this.loading = false;
          }
        }
      });
  }

  trackDonationSuccess(data: any): void {
    // Optional: Send to Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'donation_complete', {
        transaction_id: data.reference,
        value: data.amount,
        currency: data.currency
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  tryAgain(): void {
    this.router.navigate(['/donate']);
  }

  downloadReceipt(): void {
    // TODO: Implement receipt download
    console.log('Download receipt for:', this.donationDetails?.reference);
    alert('Receipt will be sent to your email');
  }
}
function gtag(arg0: string, arg1: string, arg2: { transaction_id: any; value: any; currency: any; }) {
  throw new Error('Function not implemented.');
}

