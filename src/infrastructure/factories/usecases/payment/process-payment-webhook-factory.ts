import { ProcessPaymentWebhook } from '@/application/usecases/payment'
import { makePaymentGateway } from '@/infrastructure/factories/gateways'
import { makeOrderRepository } from '@/infrastructure/factories/repositories'

export const makeProcessPaymentWebhook = (): ProcessPaymentWebhook => {
  return new ProcessPaymentWebhook(makeOrderRepository(), makePaymentGateway())
}
