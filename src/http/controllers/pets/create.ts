import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { saveUploadedFile } from '@/utils/file-upload'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await request.saveRequestFiles()
    
    const createPetBodySchema = z.object({
      name: z.string(),
      about: z.string().optional(),
      age: z.enum(['FILHOTE', 'ADULTO', 'IDOSO']),
      size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']),
      energy_level: z.enum(['01', '02', '03', '04', '05']),
      independence: z.enum(['BAIXO', 'MEDIO', 'ALTO']),
      environment: z.enum(['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE']),
      adoption_requirements: z.string(),
    })

    // Extrair dados dos campos do formulário
    const fields: Record<string, any> = {}
    for (const file of data) {
      if (file.type === 'field') {
        fields[file.fieldname] = file.value
      }
    }

    // Parse dos requirements (vem como string do FormData)
    if (fields.adoption_requirements) {
      try {
        fields.adoption_requirements = JSON.parse(fields.adoption_requirements)
      } catch {
        fields.adoption_requirements = [fields.adoption_requirements]
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
      adoption_requirements,
    } = createPetBodySchema.parse(fields)

    // Processar arquivos de imagem
    const photoUrls: string[] = []
    for (const file of data) {
      if (file.type === 'file' && file.fieldname === 'photos') {
        const uploadedFile = await saveUploadedFile(
          file.file,
          file.filename,
          file.mimetype,
        )
        photoUrls.push(uploadedFile.url)
      }
    }

    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({
      name,
      about,
      age,
      size,
      energy_level,
      independence,
      environment,
      adoption_requirements: Array.isArray(adoption_requirements) 
        ? adoption_requirements 
        : [adoption_requirements],
      photos: photoUrls,
      org_id: request.user.sub,
    })

    return reply.status(201).send({
      pet: {
        id: pet.id,
        name: pet.name,
        age: pet.age,
        size: pet.size,
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