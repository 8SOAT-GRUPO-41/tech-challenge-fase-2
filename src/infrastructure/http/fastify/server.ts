import fastify, { type FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import swaggerConfig from '@/infrastructure/swagger/swagger-config'
import errorHandler from '@/infrastructure/http/error-handler'
import { customerRoutes, orderRoutes, paymentRoutes, productRoutes } from '@/infrastructure/http/routes'
import type { HttpServer } from '../server'

export class FastifyHttpServer implements HttpServer {
	private server: FastifyInstance

	constructor() {
		this.server = fastify({
			logger:
				process.env.NODE_ENV === 'development'
					? {
							transport: {
								target: 'pino-pretty'
							},
							level: 'debug'
						}
					: true
		})
	}

	private async buildRoutes(): Promise<void> {
		this.server.register(customerRoutes, { prefix: '/customers' })
		this.server.register(productRoutes, { prefix: '/products' })
		this.server.register(orderRoutes, { prefix: '/orders' })
		this.server.register(paymentRoutes, { prefix: '/payments' })
	}

	private async buildDocs(): Promise<void> {
		await this.server
			.register(fastifySwagger, {
				openapi: swaggerConfig
			})
			.register(fastifySwaggerUI, {
				routePrefix: '/docs'
			})
	}

	async listen(port: number): Promise<void> {
		await this.buildDocs()
		await this.buildRoutes()
		this.server.setErrorHandler(errorHandler)
		await this.server.ready()
		this.server.listen({ port, host: '0.0.0.0' })
	}
}
