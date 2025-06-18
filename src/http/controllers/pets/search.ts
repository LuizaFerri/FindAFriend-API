import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'
import { petSchema } from '@/utils/swagger-schemas'

export const searchPetsSchema = {
  description: 'Buscar pets disponíveis para adoção',
  tags: ['Pets'],
  querystring: {
    type: 'object',
    required: ['city'],
    properties: {
      city: { type: 'string', description: 'Cidade (obrigatório)' },
      age: { 
        type: 'string', 
        enum: ['FILHOTE', 'ADULTO', 'IDOSO'],
        description: 'Filtrar por idade'
      },
      size: { 
        type: 'string', 
        enum: ['PEQUENO', 'MEDIO', 'GRANDE'],
        description: 'Filtrar por porte'
      },
      energy_level: { 
        type: 'string', 
        enum: ['01', '02', '03', '04', '05'],
        description: 'Filtrar por nível de energia'
      },
      independence: { 
        type: 'string', 
        enum: ['BAIXO', 'MEDIO', 'ALTO'],
        description: 'Filtrar por independência'
      },
      environment: { 
        type: 'string', 
        enum: ['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE'],
        description: 'Filtrar por ambiente'
      },
    },
  },
  response: {
    200: {
      description: 'Lista de pets encontrados',
      type: 'object',
      properties: {
        pets: {
          type: 'array',
          items: petSchema,
        },
      },
    },
    400: {
      description: 'Parâmetros inválidos (cidade é obrigatória)',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: { type: 'object' },
      },
    },
  },
}

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    city: z.string(),
    age: z.enum(['FILHOTE', 'ADULTO', 'IDOSO']).optional(),
    size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']).optional(),
    energy_level: z.enum(['01', '02', '03', '04', '05']).optional(),
    independence: z.enum(['BAIXO', 'MEDIO', 'ALTO']).optional(),
    environment: z.enum(['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE']).optional(),
  })

  const { city, age, size, energy_level, independence, environment } =
    searchPetsQuerySchema.parse(request.query)

  const searchPetsUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetsUseCase.execute({
    city,
    age,
    size,
    energy_level,
    independence,
    environment,
  })

  return reply.status(200).send({
    pets,
  })
} 