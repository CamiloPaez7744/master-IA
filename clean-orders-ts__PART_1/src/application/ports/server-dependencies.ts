import { CreateOrder } from '../use-cases/create-order.js'
import { AddItemToOrder } from '../use-cases/add-item-to-order.js'

export interface ServerDependencies {
  createOrderUseCase: CreateOrder
  addItemToOrderUseCase: AddItemToOrder
}