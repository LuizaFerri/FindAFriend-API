import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create, createPetSchema } from './create'
import { search, searchPetsSchema } from './search'
import { details, getPetDetailsSchema } from './details'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/search', { 
    schema: searchPetsSchema 
  }, search)
  
  app.get('/pets/:petId', { 
    schema: getPetDetailsSchema 
  }, details)

  app.post('/pets', { 
    onRequest: [verifyJWT], 
    schema: createPetSchema 
  }, create)
} 