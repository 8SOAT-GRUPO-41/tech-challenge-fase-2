export interface PaymentGateway {
  generatePaymentQRCode: (input: {
    totalAmount: number
    orderId: string
  }) => Promise<string>
  getPaymentDetails: (paymentId: string) => Promise<any>
}
