export interface UpiPaymentOptions {
  /** Payee UPI address (VPA), e.g. "merchant@bank" */
  pa: string;
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
   * Initiates a UPI payment by building an Android Intent from individual
   * payment parameters. The URI is constructed on the native side using
   * Uri.Builder to ensure proper encoding for UPI apps.
   */
  initiatePayment(options: UpiPaymentOptions): Promise<UpiPaymentResult>;
}
