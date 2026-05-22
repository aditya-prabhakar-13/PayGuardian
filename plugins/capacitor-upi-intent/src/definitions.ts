export interface UpiIntentPlugin {
  /**
   * Fires an Android Intent.ACTION_VIEW for the given UPI URL
   * and waits for the ActivityResult callback.
   *
   * @param options Object containing the UPI `url` (e.g. upi://pay?...)
   * @returns Resolves with the `status` (Android Activity resultCode) and the raw string `response` payload.
   */
  initiatePayment(options: { url: string }): Promise<{ status: number; response: string }>;
}
