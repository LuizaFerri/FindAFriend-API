import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'

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