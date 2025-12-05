export interface IDonationRequest {
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  amount?: number;
  currency?: string;
  purpose?: string;
  is_anonymous?: boolean;
}
