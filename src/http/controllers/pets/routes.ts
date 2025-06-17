import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { search } from './search'
import { details } from './details'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/search', search)
  app.get('/pets/:petId', details)

  app.post('/pets', { onRequest: [verifyJWT] }, create)
} 