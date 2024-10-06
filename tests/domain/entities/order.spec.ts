import { Order, Customer, OrderItem, Product } from '@/domain/entities'
import { OrderStatus, ProductCategory } from '@/domain/enums'
import { DomainError } from '@/domain/errors'

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('unique-id')
}))

const validCustomer = Customer.create('44204681816', 'any_email')
const validProduct = Product.create('any_name', ProductCategory.FOOD, 10, 'any_description')
const validOrderItem = OrderItem.create(validProduct, 2)
const validStatus = OrderStatus.IN_PREPARATION

describe(Order.name, () => {
  it('should create an order with valid input', () => {
    const order = Order.create(validCustomer, [validOrderItem])

    expect(order).toBeInstanceOf(Order)
    expect(order.orderId).toBe('unique-id')
    expect(order.getCustomer()).toBe(validCustomer)
    expect(order.getOrderItems()).toStrictEqual([validOrderItem])
    expect(order.getStatus()).toBe(OrderStatus.AWAITING_PAYMENT)
    expect(order.getTotal()).toBe(20)
  })

  it('should restore an order with valid input', () => {
    const orderId = 'restored-id'
    const order = Order.restore(orderId, validCustomer, [validOrderItem], validStatus)

    expect(order).toBeInstanceOf(Order)
    expect(order.orderId).toBe(orderId)
    expect(order.getCustomer()).toBe(validCustomer)
    expect(order.getOrderItems()).toStrictEqual([validOrderItem])
    expect(order.getStatus()).toBe(validStatus)
    expect(order.getTotal()).toBe(20)
  })

  it('should set a new order items', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    const newOrderItems = [OrderItem.create(validProduct, 3)]
    order.setOrderItems(newOrderItems)

    expect(order.getOrderItems()).toStrictEqual(newOrderItems)
  })

  it('should pay an order', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    order.pay()

    expect(order.getStatus()).toBe(OrderStatus.PAID)
  })

  it('should receive an order', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    order.pay()
    order.receive()

    expect(order.getStatus()).toBe(OrderStatus.RECEIVED)
  })

  it('should prepare an order', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    order.pay()
    order.receive()
    order.prepare()

    expect(order.getStatus()).toBe(OrderStatus.IN_PREPARATION)
  })

  it('should complete an order', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    order.pay()
    order.receive()
    order.prepare()
    order.ready()
    order.complete()

    expect(order.getStatus()).toBe(OrderStatus.COMPLETED)
  })

  it('should ready an order', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    order.pay()
    order.receive()
    order.prepare()
    order.ready()

    expect(order.getStatus()).toBe(OrderStatus.READY)
  })

  it('should throw if try to set empty order items', () => {
    const order = Order.create(validCustomer, [validOrderItem])

    expect(() => order.setOrderItems([])).toThrow(new DomainError('Order must have at least one item'))
  })

  it('should throw if try to restore an order with empty order items', () => {
    expect(() => Order.restore('any_id', validCustomer, [], validStatus)).toThrow(
      new DomainError('Order must have at least one item')
    )
  })

  it('should throw if try to transition from RECEIVED to COMPLETED', () => {
    const order = Order.restore('any_id', validCustomer, [validOrderItem], OrderStatus.RECEIVED)

    expect(() => order.complete()).toThrow(
      new DomainError(`Can't transition from ${OrderStatus.RECEIVED} to ${OrderStatus.COMPLETED}`)
    )
  })

  it('should throw if try to transition from RECEIVED to READY', () => {
    const order = Order.restore('any_id', validCustomer, [validOrderItem], OrderStatus.RECEIVED)

    expect(() => order.ready()).toThrow(
      new DomainError(`Can't transition from ${OrderStatus.RECEIVED} to ${OrderStatus.READY}`)
    )
  })

  it('should throw if try to transition from IN_PREPARATION to COMPLETED', () => {
    const order = Order.restore('any_id', validCustomer, [validOrderItem], OrderStatus.IN_PREPARATION)

    expect(() => order.complete()).toThrow(
      new DomainError(`Can't transition from ${OrderStatus.IN_PREPARATION} to ${OrderStatus.COMPLETED}`)
    )
  })

  it('should throw if try to transition from READY to IN_PREPARATION', () => {
    const order = Order.restore('any_id', validCustomer, [validOrderItem], OrderStatus.READY)

    expect(() => order.prepare()).toThrow(
      new DomainError(`Can't transition from ${OrderStatus.READY} to ${OrderStatus.IN_PREPARATION}`)
    )
  })

  it('should throw if try to transition from COMPLETED to IN_PREPARATION', () => {
    const order = Order.restore('any_id', validCustomer, [validOrderItem], OrderStatus.COMPLETED)

    expect(() => order.prepare()).toThrow(
      new DomainError(`Can't transition from ${OrderStatus.COMPLETED} to ${OrderStatus.IN_PREPARATION}`)
    )
  })

  it('should throw if try to transition from COMPLETED to READY', () => {
    const order = Order.restore('any_id', validCustomer, [validOrderItem], OrderStatus.COMPLETED)

    expect(() => order.ready()).toThrow(
      new DomainError(`Can't transition from ${OrderStatus.COMPLETED} to ${OrderStatus.READY}`)
    )
  })

  it('should return correct JSON representation', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    const expectedJson = {
      orderId: 'unique-id',
      customer: validCustomer.toJSON(),
      orderItems: [validOrderItem.toJSON()],
      status: OrderStatus.AWAITING_PAYMENT,
      total: 20
    }

    expect(order.toJSON()).toEqual(expectedJson)
  })

  it('should calculate total correctly', () => {
    const order = Order.create(validCustomer, [validOrderItem])
    const newOrderItem = OrderItem.create(validProduct, 3)
    order.setOrderItems([validOrderItem, newOrderItem])

    expect(order.getTotal()).toBe(50)
  })

  it('should throw when trying to transition to the same current status', () => {
    const order = Order.restore('any_id', validCustomer, [validOrderItem], OrderStatus.READY)

    expect(() => order.ready()).toThrow(new DomainError(`The order is already in the ${OrderStatus.READY} status`))
  })
})
