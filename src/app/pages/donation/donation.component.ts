import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService } from '../../services/donation.service';
import { IDonationStatus } from '../../models/i-donation-status';

@Component({
  selector: 'app-donation',
  standalone: false,
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss'
})
export class DonationComponent implements OnInit {
  selectedAmount: number | null = null;
  customAmount: string = '';
  donationType: 'one-time' | 'monthly' = 'one-time';
  showDonationPopup: boolean = false;

    // Payment callback states
  showPaymentResult: boolean = false;
  paymentStatus: 'checking' | 'success' | 'failed' | 'timeout' = 'checking';
  donationDetails: any = null;
  errorMessage: string = '';
  isVerifying: boolean = false;


  predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private donationService: DonationService,
  ) {}

  ngOnInit(): void {
    // Check if we're coming back from Paystack
    this.handlePaystackCallback();

      // Auto-dismiss success toast after 5 seconds
    // if (this.paymentStatus === 'success') {
    //   setTimeout(() => this.closePaymentResult(), 5000);
    // }
  }

  // ─── PAYSTACK CALLBACK HANDLER ────────────────────────────────────
  handlePaystackCallback(): void {
    // Check for Paystack redirect parameters
    const reference =
      this.route.snapshot.queryParamMap.get('reference') ||
      this.route.snapshot.queryParamMap.get('trxref') ||
      sessionStorage.getItem('donation_reference');

      console.log('🔍 Checking for reference:', reference); // DEBUG

    if (reference) {
      // We have a payment reference, verify it
       console.log('✅ Reference found, starting verification'); // DEBUG

      this.showPaymentResult = true;
      this.isVerifying = true;
      this.verifyPayment(reference);

      // Clear session storage
      sessionStorage.removeItem('donation_reference');

      // Clean up URL (remove query params)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

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

  openDonationPopup(): void {
    this.showDonationPopup = true;
  }

  closeDonationPopup(): void {
    this.showDonationPopup = false;
  }


  /////////////////////
    verifyPayment(reference: string): void {
      console.log('🔄 Starting polling for:', reference); // DEBUG

    this.donationService.pollPaymentStatus(reference, 60) // Poll for up to 2 minutes
      .subscribe({
        next: (response: IDonationStatus) => {
          console.log('📥 Poll response:', response);

          if (response.success && response.data) {



            const status = response.data.status;

            console.log('💡 Payment status:', status)

            if (status === 'success') {
              this.paymentStatus = 'success';
              this.donationDetails = response.data;
              this.isVerifying = false;

              setTimeout(() => this.closePaymentResult(), 5000);

              // Optional: Track conversion
              this.trackDonationSuccess(response.data);
            } else if (status === 'failed') {
              this.paymentStatus = 'failed';
              this.errorMessage = 'Payment was not successful';
              this.isVerifying = false;
            } else if (status === 'abandoned') {
              this.paymentStatus = 'failed';
              this.errorMessage = 'Payment was abandoned';
              this.isVerifying = false;
            }
            // If still pending, polling continues
          }
        },
        error: (err) => {
          console.error('Payment verification error:', err);
          this.paymentStatus = 'timeout';
          this.errorMessage = 'Unable to verify payment. Please check your email or contact support.';
          this.isVerifying = false;
        },
        complete: () => {
          if (this.isVerifying) {
            this.paymentStatus = 'timeout';
            this.errorMessage = 'Payment verification timeout. Please check your email.';
            this.isVerifying = false;
          }
        }
      });
  }

  trackDonationSuccess(data: any): void {
    // Optional: Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'donation_complete', {
        transaction_id: data.reference,
        value: data.amount,
        currency: data.currency
      });
    }
  }

  // ─── PAYMENT RESULT ACTIONS ───────────────────────────────────────
  closePaymentResult(): void {
    this.showPaymentResult = false;
    this.paymentStatus = 'checking';
    this.donationDetails = null;
    this.errorMessage = '';
  }

  tryAgain(): void {
    this.closePaymentResult();
    this.openDonationPopup();
  }

  downloadReceipt(): void {
    // TODO: Implement receipt download
    alert('Receipt has been sent to your email');
  }
}
function gtag(arg0: string, arg1: string, arg2: { transaction_id: any; value: any; currency: any; }) {
  throw new Error('Function not implemented.');
}

