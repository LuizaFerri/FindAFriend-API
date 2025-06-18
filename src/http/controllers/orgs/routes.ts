import { FastifyInstance } from 'fastify'
import { register, registerOrgSchema } from './register'
import { authenticate, authenticateOrgSchema } from './authenticate'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', { schema: registerOrgSchema }, register)
  app.post('/sessions', { schema: authenticateOrgSchema }, authenticate)
} 