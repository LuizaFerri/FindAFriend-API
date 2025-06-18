import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case'
import { petSchema, orgSchema } from '@/utils/swagger-schemas'

export const getPetDetailsSchema = {
  description: 'Obter detalhes completos de um pet',
  tags: ['Pets'],
  params: {
    type: 'object',
    required: ['petId'],
    properties: {
      petId: { type: 'string', format: 'uuid', description: 'ID do pet' },
    },
  },
  response: {
    200: {
      description: 'Detalhes do pet e organização responsável',
      type: 'object',
      properties: {
        pet: {
          type: 'object',
          allOf: [
            petSchema,
            {
              properties: {
                org: orgSchema,
              },
            },
          ],
        },
      },
    },
    404: {
      description: 'Pet não encontrado',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      description: 'ID do pet inválido',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: { type: 'object' },
      },
    },
  },
}

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getPetParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = getPetParamsSchema.parse(request.params)

  try {
    const getPetDetailsUseCase = makeGetPetDetailsUseCase()

    const { pet } = await getPetDetailsUseCase.execute({
      petId,
    })

    return reply.status(200).send({
      pet,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
} 