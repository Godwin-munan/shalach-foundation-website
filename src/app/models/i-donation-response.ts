export interface IDonationResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    authorization_url: string;
    access_code: string;
    public_key: string;
  };
}
