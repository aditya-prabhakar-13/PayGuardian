export interface UpiPaymentOptions {
  /**
   * Raw UPI URL string (e.g. from a QR code scan).
   * If provided, it is passed directly to the UPI app without re-encoding.
   * When url is provided, all other fields are ignored.
   */
  url?: string;

  /** Payee UPI address (VPA), e.g. "merchant@bank" — required if url is not provided */
  pa?: string;
  /** Payee name */
  pn?: string;
  /** Amount */
  am?: string;
  /** Transaction note */
  tn?: string;
  /** Transaction reference ID (unique per transaction) */
  tr?: string;
}

export interface UpiPaymentResult {
  /** Android Activity result code */
  status: number;
  /** Raw response string from the UPI app */
  response: string;
}

export interface UpiIntentPlugin {
  /**
   * Initiates a UPI payment. Accepts either:
   * - A raw `url` string (passed directly to Android Intent)
   * - Individual params (pa, pn, am, etc.) which are assembled into a URI natively
   */
  initiatePayment(options: UpiPaymentOptions): Promise<UpiPaymentResult>;
}
