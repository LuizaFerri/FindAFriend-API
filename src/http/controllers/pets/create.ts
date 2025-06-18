import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { saveUploadedFile } from '@/utils/file-upload'
import { petSchema } from '@/utils/swagger-schemas'

export const createPetSchema = {
  description: 'Cadastrar um novo pet para adoção',
  tags: ['Pets'],
  security: [{ bearerAuth: [] }],
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    required: ['name', 'age', 'size', 'energy_level', 'independence', 'environment', 'adoption_requirements'],
    properties: {
      name: { type: 'string', description: 'Nome do pet' },
      about: { type: 'string', description: 'Descrição do pet (opcional)' },
      age: { 
        type: 'string', 
        enum: ['FILHOTE', 'ADULTO', 'IDOSO'],
        description: 'Idade do pet'
      },
      size: { 
        type: 'string', 
        enum: ['PEQUENO', 'MEDIO', 'GRANDE'],
        description: 'Porte do pet'
      },
      energy_level: { 
        type: 'string', 
        enum: ['01', '02', '03', '04', '05'],
        description: 'Nível de energia (1-5)'
      },
      independence: { 
        type: 'string', 
        enum: ['BAIXO', 'MEDIO', 'ALTO'],
        description: 'Nível de independência'
      },
      environment: { 
        type: 'string', 
        enum: ['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE'],
        description: 'Ambiente adequado'
      },
      adoption_requirements: {
        type: 'string',
        description: 'Requisitos para adoção (JSON array de strings)'
      },
      photos: {
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Fotos do pet (máximo 10 arquivos, 5MB cada)'
      },
    },
  },
  response: {
    201: {
      description: 'Pet cadastrado com sucesso',
      type: 'object',
      properties: {
        pet: petSchema,
      },
    },
    401: {
      description: 'Token de autenticação inválido ou ausente',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      description: 'Dados inválidos',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: { type: 'object' },
      },
    },
  },
}

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