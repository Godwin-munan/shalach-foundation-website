import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Output, Renderer2 } from '@angular/core';
import { Observable, of, timeout, take, mergeMap, finalize, catchError, throwError } from 'rxjs';

declare const PaystackPop: any;

@Component({
  selector: 'app-donation-popup',
  standalone: false,
  templateUrl: './donation-popup.component.html',
  styleUrl: './donation-popup.component.scss'
})
export class DonationPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  donorInfo = {
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    donationType: 'one-time',
    paymentMethod: 'online'
  };

  suggestedAmounts = [5000, 10000, 25000, 50000, 100000];
  selectedAmount: number | null = null;

  bankDetails = {
    bankName: 'Sample Bank',
    accountName: 'Shalach Empowerment Foundation',
    accountNumber: '0123456789',
    sortCode: '012345'
  };

  showBankDetails = false;
  isProcessing = false;
  showSuccess = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // ─── SCRIPT LOADING ───────────────────────────────────────────────
  private loadPaystackScript(): Observable<void> {
    if ((window as any).PaystackPop) {
      return of(undefined);
    }

    return new Observable<void>(observer => {
      const script = this.renderer.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js'; // ← NO TRAILING SPACES!
      script.async = true;

      const onLoad = this.renderer.listen(script, 'load', () => {
        onLoad(); onError();
        observer.next(); observer.complete();
      });

      const onError = this.renderer.listen(script, 'error', () => {
        onLoad(); onError();
        observer.error('Failed to load Paystack script');
      });

      return () => { onLoad(); onError(); };
      this.renderer.appendChild(this.document.body, script);
    }).pipe(timeout(10000), take(1));
  }

  // ─── FORM METHODS ─────────────────────────────────────────────────
  selectAmount(amount: number) {
    this.selectedAmount = amount;
    this.donorInfo.amount = amount.toString();
  }

  selectPaymentMethod(method: 'online' | 'bank-transfer') {
    this.donorInfo.paymentMethod = method;
    this.showBankDetails = method === 'bank-transfer';
  }

  onCustomAmountChange() {
    this.selectedAmount = null;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Account number copied!');
    });
  }

  isFormValid(): boolean {
    return !!(
      this.donorInfo.fullName &&
      this.donorInfo.email &&
      this.donorInfo.amount &&
      parseFloat(this.donorInfo.amount) >= 100
    );
  }

  // ─── SUBMISSION ───────────────────────────────────────────────────
  submitDonation() {
    if (!this.isFormValid()) {
      alert('Please fill all required fields with a valid amount (min ₦100).');
      return;
    }

    if (this.donorInfo.paymentMethod === 'online') {
      this.initiateOnlinePayment();
    } else {
      this.showSuccess = true;
    }
  }

  // ─── PAYSTACK INTEGRATION ─────────────────────────────────────────
  initiateOnlinePayment() {
    this.isProcessing = true;
    const amountInKobo = Math.round(parseFloat(this.donorInfo.amount) * 100);

    this.loadPaystackScript().pipe(
      mergeMap(() => {
        const Paystack = (window as any).PaystackPop;
        if (typeof Paystack !== 'function') {
          throw new Error('Paystack SDK not available');
        }

        return new Observable(observer => {
          const paystack = new Paystack();
          paystack.newTransaction({
            key: 'pk_test_your_real_public_key_here', // ← REPLACE THIS!
            email: this.donorInfo.email,
            amount: amountInKobo,
            firstname: this.donorInfo.fullName.split(' ')[0] || '',
            lastname: this.donorInfo.fullName.split(' ').slice(1).join(' ') || '',
            phone: this.donorInfo.phone || undefined,
            onSuccess: (transaction: any) => observer.next(transaction),
            onCancel: () => observer.error('cancelled')
          });
        });
      }),
      finalize(() => this.isProcessing = false),
      catchError(err => {
        console.error('Payment error:', err);
        if (err !== 'cancelled') {
          alert('Failed to start payment. Please try again.');
        }
        return throwError(err);
      })
    ).subscribe({
      next: () => {
        this.showSuccess = true;
        // TODO: Send transaction reference to backend for verification
      },
      error: (err) => {
        if (err === 'cancelled') console.log('User cancelled payment');
      }
    });
  }

  // ─── UI CONTROL ───────────────────────────────────────────────────
  close() {
    this.closePopup.emit();
  }

  resetAndClose() {
    this.showSuccess = false;
    this.donorInfo = {
      fullName: '',
      email: '',
      phone: '',
      amount: '',
      donationType: 'one-time',
      paymentMethod: 'online'
    };
    this.selectedAmount = null;
    this.close();
  }
}
