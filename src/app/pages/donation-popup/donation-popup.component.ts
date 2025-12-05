import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Output, Renderer2 } from '@angular/core';
import { Observable, of, timeout, take, mergeMap, finalize, catchError, throwError } from 'rxjs';
import { DonationService } from '../../services/donation.service';
import { Router } from '@angular/router';
import { IDonationRequest } from '../../models/i-donation-request';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare const PaystackPop: any;

@Component({
  selector: 'app-donation-popup',
  standalone: false,
  templateUrl: './donation-popup.component.html',
  styleUrl: './donation-popup.component.scss'
})
export class DonationPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  donationForm!: FormGroup;
  loading = false;
  error: string | null = null;
  showSuccess = false;
  showBankDetails = false;
  successMessage: string = 'Your support makes a real difference in our community.';
  amountDisplay: string = '';

  suggestedAmounts = [5000, 10000, 25000, 50000, 100000];
  selectedAmount: number | null = null;

  bankAccounts = [
    {
      bankName: 'UBA',
      accountName: 'Shalach Empowerment Foundation',
      accountNumber: '1028497609',
      accountType: 'Naira Account'
    },
    {
      bankName: 'UBA',
      accountName: 'Shalach Empowerment Foundation',
      accountNumber: '3004885585',
      accountType: 'Dollar Account'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // ─── FORM INITIALIZATION ──────────────────────────────────────────
  initForm(): void {
    this.donationForm = this.fb.group({
      donor_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      donor_email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      donor_phone: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      amount: [null, [Validators.required, Validators.min(100), Validators.max(10000000)]],
      currency: ['NGN'],
      purpose: ['General Donation', [Validators.maxLength(500)]],
      is_anonymous: [false],
      payment_method: ['online', Validators.required]
    });

    // Watch payment method changes
    this.donationForm.get('payment_method')?.valueChanges.subscribe(method => {
      this.showBankDetails = method === 'bank-transfer';
    });
  }

  // ─── FORM GETTERS ─────────────────────────────────────────────────
  get f() {
    return this.donationForm.controls;
  }

  get isDonorNameInvalid(): boolean {
    const control = this.f['donor_name'];
    return control.invalid && (control.dirty || control.touched);
  }

  get isDonorEmailInvalid(): boolean {
    const control = this.f['donor_email'];
    return control.invalid && (control.dirty || control.touched);
  }

  get isAmountInvalid(): boolean {
    const control = this.f['amount'];
    return control.invalid && (control.dirty || control.touched);
  }

  // ─── AMOUNT HANDLING ──────────────────────────────────────────────
  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.donationForm.patchValue({ amount });
    this.amountDisplay = this.formatNumberWithCommas(amount);
  }

  // Allow only digits on keypress (blocks letters)
  onAmountKeyPress(event: KeyboardEvent): void {
    const allowed = /[0-9]/;
    const char = event.key; // modern browsers: event.key is preferred
    // allow Backspace, Delete, Arrow keys, etc.
    if (char.length === 1 && !allowed.test(char)) {
      event.preventDefault();
    }
  }

  onCustomAmountChange(event: Event): void {
    this.selectedAmount = null;

    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/,/g, ''); // Remove existing commas

    // Update the actual form value (numeric)
    const numericValue = parseFloat(rawValue) || 0;
    this.donationForm.patchValue({ amount: numericValue }, { emitEvent: false });

    // Format for display with commas
    if (rawValue && !isNaN(numericValue)) {
      this.amountDisplay = this.formatNumberWithCommas(numericValue);
    } else {
      this.amountDisplay = '';
    }
  }

  onCustomAmountChangeV2(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove commas and any non-digit chars
    let raw = (input.value || '').replace(/,/g, '').replace(/[^\d]/g, '');

    // Prevent leading zeros like "000" turning into 0 unpredictably
    raw = raw.replace(/^0+(?=\d)/, '');

    if (raw === '') {
      // Clear display and set form control to null so validators run
      this.amountDisplay = '';
      this.donationForm.patchValue({ amount: null }); // triggers validators
      this.f['amount'].markAsTouched();
      this.f['amount'].markAsDirty();
      return;
    }

    // Convert to integer (NGN - no decimals). If you allow decimals, use parseFloat
    const numericValue = parseInt(raw, 10);

    // Format for display with commas
    this.amountDisplay = this.formatNumberWithCommas(numericValue);

    // Update the form control with the numeric value so validators run
    this.donationForm.patchValue({ amount: numericValue }); // do not pass { emitEvent:false }
    this.f['amount'].markAsTouched();
    this.f['amount'].markAsDirty();
  }

  // Add this helper method
  formatNumberWithCommas(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatAmount(value: number): string {
    if (!value) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // ─── PAYMENT METHOD ───────────────────────────────────────────────
  selectPaymentMethod(method: 'online' | 'bank-transfer'): void {
    this.donationForm.patchValue({ payment_method: method });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // You can replace alert with a toast notification
      alert('Account number copied!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  // ─── FORM SUBMISSION ──────────────────────────────────────────────
  submitDonation(): void {
    // Mark all fields as touched to show validation errors
    this.donationForm.markAllAsTouched();

    if (this.donationForm.invalid) {
      this.error = 'Please fill all required fields correctly.';
      return;
    }

    const paymentMethod = this.donationForm.get('payment_method')?.value;

    if (paymentMethod === 'online') {
      this.initiateOnlinePayment();
    } else {
      // Bank transfer - just show success
      //this.showSuccess = true;
      this.bankTransferInitiatePayment();
    }
  }

  //───  BANK TRANSFER ─────────────────────────────────────────
  bankTransferInitiatePayment(): void {
    this.loading = true;
    this.error = null;

    // Build payload from form (exclude payment_method)
    const { payment_method, ...donationData } = this.donationForm.value;

    const payload: IDonationRequest = {
      ...donationData,
      // Ensure phone is undefined if empty (not empty string)
      donor_phone: donationData.donor_phone || undefined
    };

    this.donationService.bankTransferPayment(payload)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Store reference in sessionStorage for callback page
            //sessionStorage.setItem('donation_reference', response.data.reference);

            // Redirect to Paystack payment page
            //window.location.href = response.data.authorization_url;
            this.successMessage = response.message;
            this.showSuccess = true;
            this.loading = false;
          } else {
            this.error = response.message || 'Failed to initialize payment';
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Payment initialization error:', err);

          // Handle validation errors
          if (err.status === 422 && err.error?.errors) {
            const errors = err.error.errors;
            const errorMessages = Object.values(errors).flat();
            this.error = errorMessages.join(', ');
          } else {
            this.error = err.error?.message || 'An error occurred. Please try again.';
          }

          this.loading = false;
        }
      });
  }

  // ─── PAYSTACK INTEGRATION ─────────────────────────────────────────
  initiateOnlinePayment(): void {
    this.loading = true;
    this.error = null;

    // Build payload from form (exclude payment_method)
    const { payment_method, ...donationData } = this.donationForm.value;

    const payload: IDonationRequest = {
      ...donationData,
      // Ensure phone is undefined if empty (not empty string)
      donor_phone: donationData.donor_phone || undefined
    };

    this.donationService.initializePayment(payload)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Store reference in sessionStorage for callback page
            sessionStorage.setItem('donation_reference', response.data.reference);

            // Redirect to Paystack payment page
            window.location.href = response.data.authorization_url;
          } else {
            this.error = response.message || 'Failed to initialize payment';
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Payment initialization error:', err);

          // Handle validation errors
          if (err.status === 422 && err.error?.errors) {
            const errors = err.error.errors;
            const errorMessages = Object.values(errors).flat();
            this.error = errorMessages.join(', ');
          } else {
            this.error = err.error?.message || 'An error occurred. Please try again.';
          }

          this.loading = false;
        }
      });
  }

  // ─── UI CONTROL ───────────────────────────────────────────────────
  close(): void {
    this.closePopup.emit();
  }

  resetAndClose(): void {
    this.showSuccess = false;
    this.amountDisplay = '';
    this.donationForm.reset({
      donor_name: '',
      donor_email: '',
      donor_phone: '',
      amount: null,
      currency: 'NGN',
      purpose: 'General Donation',
      is_anonymous: false,
      payment_method: 'online'
    });
    this.selectedAmount = null;
    this.error = null;
    this.loading = false;
    this.close();
  }

  // Helper to check if form is valid
  isFormValid(): boolean {
    return this.donationForm.valid;
  }
}
