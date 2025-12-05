import { IDonationRequest } from "./i-donation-request";

export class DonationRequest implements IDonationRequest {
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string | undefined;
  amount?: number;
  currency?: string | undefined;
  purpose?: string | undefined;
  is_anonymous?: boolean | undefined;


    constructor(data?: IDonationRequest) {
      if (data) {
        for (let property in data) {
          if (Object.prototype.hasOwnProperty.call(data, property)) {
            (this as any)[property] = (data as any)[property];
          }
        }
      }
  }
}
