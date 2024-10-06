import { HttpStatusCode } from '@/infrastructure/http/helper'
import type { HttpRequest, HttpResponse } from '@/infrastructure/http/interfaces'
import type { Controller } from '@/infrastructure/controllers/interfaces'
import type { OrderStatus } from '@/domain/enums'
import type { UpdateOrderStatus } from '@/application/usecases/order'
import type { CreatePayment } from '@/application/usecases/payment'

interface FakeCheckoutInput {
  orderId: string
  status: OrderStatus
}

interface CreatePaymentInput {
  orderId: string
}

export class FakeCheckoutController implements Controller {
  constructor(private readonly updateOrderUseCase: UpdateOrderStatus) {}

  async handle(request: HttpRequest<FakeCheckoutInput>): Promise<HttpResponse> {
    const input = request.body
    const result = await this.updateOrderUseCase.execute(input)
    return {
      statusCode: HttpStatusCode.OK,
      body: result.toJSON()
    }
  }
}

export class CreatePaymentController implements Controller {
  constructor(private readonly createPaymentUseCase: CreatePayment) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const input = request.body as CreatePaymentInput
    const qrCode = await this.createPaymentUseCase.execute(input)
    return {
      statusCode: HttpStatusCode.OK,
      body: qrCode
    }
  }
}
