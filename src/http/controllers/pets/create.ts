import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { saveUploadedFile } from '@/utils/file-upload'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parts = request.parts()
    
    const createPetBodySchema = z.object({
      name: z.string().min(1),
      about: z.string().optional(),
      age: z.enum(['FILHOTE', 'ADULTO', 'IDOSO']),
      size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']),
      energy_level: z.enum(['01', '02', '03', '04', '05']),
      independence: z.enum(['BAIXO', 'MEDIO', 'ALTO']),
      environment: z.enum(['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE']),
      adoption_requirements: z.string(),
    })

    const fields: Record<string, any> = {}
    const photoUrls: string[] = []
    
    for await (const part of parts) {
      if (part.type === 'field') {
        fields[part.fieldname] = part.value
      } else if (part.type === 'file' && part.fieldname === 'photos') {
        const uploadedFile = await saveUploadedFile(
          part.file,
          part.filename || 'photo.jpg',
          part.mimetype,
        )
        photoUrls.push(uploadedFile.url)
      }
    }

    let adoptionRequirements: string[] = []
    if (fields.adoption_requirements) {
      try {
        const parsed = JSON.parse(fields.adoption_requirements)
        adoptionRequirements = Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        adoptionRequirements = [fields.adoption_requirements]
      }
    }

    const {
      name,
      about,
      age,
      size,
      energy_level,
      independence,
      environment,
    } = createPetBodySchema.parse(fields)

    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({
      name,
      about,
      age,
      size,
      energy_level,
      independence,
      environment,
      adoption_requirements: adoptionRequirements,
      photos: photoUrls,
      org_id: request.user.sub,
    })

    return reply.status(201).send({
      pet: {
        id: pet.id,
        name: pet.name,
        about: pet.about,
        age: pet.age,
        size: pet.size,
        energy_level: pet.energy_level,
        independence: pet.independence,
        environment: pet.environment,
        adoption_requirements: pet.adoption_requirements,
        photos: pet.photos,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
} 