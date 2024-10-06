import type { PaymentGateway } from '@/application/ports'
import axios, { type AxiosInstance } from 'axios'

interface MercadoPagoCreatePaymentResponse {
  qr_data: string
}

interface MercadoPagoPaymentDetailsResponse {
  external_reference: string
  status:
    | 'approved'
    | 'pending'
    | 'authorized'
    | 'in_process'
    | 'in_mediation'
    | 'rejected'
    | 'cancelled'
    | 'refunded'
    | 'charged_back'
}

// TODO: implement error handling
export class MercadoPagoGateway implements PaymentGateway {
  private readonly mercadoPagoInstance: AxiosInstance
  private readonly mercadoPagoUserId: string
  private readonly mercadoPagoExternalPosId: string

  constructor() {
    this.mercadoPagoInstance = axios.create({
      baseURL: process.env.MERCADO_PAGO_API_URL,
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
      }
    })
    this.mercadoPagoUserId = process.env.MERCADO_PAGO_USER_ID || ''
    this.mercadoPagoExternalPosId = process.env.MERCADO_PAGO_EXTERNAL_POS_ID || ''
  }

  async generatePaymentQRCode(input: {
    totalAmount: number
    orderId: string
  }): Promise<string> {
    try {
      const response = await this.mercadoPagoInstance.post<MercadoPagoCreatePaymentResponse>(
        `/instore/orders/qr/seller/collectors/${this.mercadoPagoUserId}/pos/${this.mercadoPagoExternalPosId}/qrs`,
        {
          external_reference: input.orderId,
          title: 'LG41-Combo',
          description: 'Combo LG41',
          notification_url: 'https://2f53-177-68-169-92.ngrok-free.app',
          total_amount: input.totalAmount,
          items: [
            {
              sku_number: '1234',
              category: 'FOOD',
              title: 'Combo LG41',
              unit_price: input.totalAmount,
              quantity: 1,
              total_amount: input.totalAmount,
              unit_measure: 'unit'
            }
          ]
        }
      )
      return response.data.qr_data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // TODO: update types
  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      const response = await this.mercadoPagoInstance.get<MercadoPagoPaymentDetailsResponse>(
        `/v1/payments/${paymentId}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
