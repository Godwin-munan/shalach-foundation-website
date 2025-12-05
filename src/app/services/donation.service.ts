import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { IDonationRequest } from '../models/i-donation-request';
import { interval, Observable, switchMap, takeWhile, tap } from 'rxjs';
import { IDonationResponse } from '../models/i-donation-response';
import { IDonationStatus } from '../models/i-donation-status';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = environment.baseurl;

  constructor(private http: HttpClient) {}

  /**
   * Initialize donation and get Paystack URL
   */
  initializePayment(data: IDonationRequest): Observable<IDonationResponse> {
    return this.http.post<IDonationResponse>(`${this.apiUrl}/donations/initialize`, data);
  }

  /**
   * Initialize donation and get Paystack URL
   */
  bankTransferPayment(data: IDonationRequest): Observable<IDonationResponse> {
    return this.http.post<IDonationResponse>(`${this.apiUrl}/donations/bank-transfer`, data);
  }

  /**
   * Check payment status (for polling after redirect)
   */
  checkPaymentStatus(reference: string): Observable<IDonationStatus> {
    return this.http.get<IDonationStatus>(`${this.apiUrl}/donations/verify/${reference}`);
  }

  /**
   * Poll status until payment is complete
   */
  pollPaymentStatus(reference: string, maxAttempts: number = 30): Observable<IDonationStatus> {
    let attempts = 0;

    return interval(2000).pipe( // Check every 2 seconds
      switchMap(() => this.checkPaymentStatus(reference)),
      tap(() => attempts++),
      takeWhile((response) => {
        const isStillPending = response.data?.status === 'pending';
        const hasAttemptsLeft = attempts < maxAttempts;
        return isStillPending && hasAttemptsLeft;
      }, true) // Include the final emission
    );
  }
}
