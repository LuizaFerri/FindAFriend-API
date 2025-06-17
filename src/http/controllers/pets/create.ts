import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string().optional(),
    age: z.enum(['FILHOTE', 'ADULTO', 'IDOSO']),
    size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']),
    energy_level: z.enum(['01', '02', '03', '04', '05']),
    independence: z.enum(['BAIXO', 'MEDIO', 'ALTO']),
    environment: z.enum(['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE']),
    adoption_requirements: z.array(z.string()).min(1),
  })

  const {
    name,
    about,
    age,
    size,
    energy_level,
    independence,
    environment,
    adoption_requirements,
  } = createPetBodySchema.parse(request.body)

  try {
    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({
      name,
      about,
      age,
      size,
      energy_level,
      independence,
      environment,
      adoption_requirements,
      org_id: request.user.sub,
    })

    return reply.status(201).send({
      pet: {
        id: pet.id,
        name: pet.name,
        age: pet.age,
        size: pet.size,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
} 