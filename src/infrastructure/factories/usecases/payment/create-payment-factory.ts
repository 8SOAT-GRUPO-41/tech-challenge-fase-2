import { CreatePayment } from '@/application/usecases/payment'
import { makePaymentGateway } from '@/infrastructure/factories/gateways'
import { makeOrderRepository } from '@/infrastructure/factories/repositories'

export const makeCreatePayment = (): CreatePayment => {
  return new CreatePayment(makeOrderRepository(), makePaymentGateway())
}
