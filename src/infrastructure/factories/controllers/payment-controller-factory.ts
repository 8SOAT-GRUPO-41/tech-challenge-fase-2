import { CreatePaymentController, FakeCheckoutController } from '@/infrastructure/controllers/payment-controller'
import { makeUpdateOrderStatus } from '@/infrastructure/factories/usecases/order'
import type { Controller } from '@/infrastructure/controllers/interfaces'
import { makeCreatePayment } from '../usecases/payment'

export const makeFakeCheckoutController = (): Controller => {
  return new FakeCheckoutController(makeUpdateOrderStatus())
}

export const makeCreatePaymentController = (): Controller => {
  return new CreatePaymentController(makeCreatePayment())
}
