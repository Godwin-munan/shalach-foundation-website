export interface IDonationStatus {
  success: boolean;
  data?: {
    reference: string;
    status: 'pending' | 'success' | 'failed' | 'abandoned';
    amount: number;
    currency: string;
    paid_at: string | null;
    payment_channel: string | null;
  };
}
