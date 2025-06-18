import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { makeRegisterOrgUseCase } from '@/use-cases/factories/make-register-org-use-case'

export const registerOrgSchema = {
  description: 'Registrar uma nova organização',
  tags: ['ORGs'],
  body: {
    type: 'object',
    required: ['name', 'author_name', 'email', 'whatsapp', 'password', 'cep', 'state', 'city', 'neighborhood', 'street', 'latitude', 'longitude'],
    properties: {
      name: { type: 'string', description: 'Nome da organização' },
      author_name: { type: 'string', description: 'Nome do responsável' },
      email: { type: 'string', format: 'email', description: 'Email da organização' },
      whatsapp: { type: 'string', description: 'WhatsApp para contato' },
      password: { type: 'string', minLength: 6, description: 'Senha (mínimo 6 caracteres)' },
      cep: { type: 'string', description: 'CEP da organização' },
      state: { type: 'string', description: 'Estado' },
      city: { type: 'string', description: 'Cidade' },
      neighborhood: { type: 'string', description: 'Bairro' },
      street: { type: 'string', description: 'Rua e número' },
      latitude: { type: 'number', description: 'Latitude da localização' },
      longitude: { type: 'number', description: 'Longitude da localização' },
    },
  },
  response: {
    201: {
      description: 'Organização registrada com sucesso',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    409: {
      description: 'Email já está em uso',
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

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    author_name: z.string(),
    email: z.string().email(),
    whatsapp: z.string(),
    password: z.string().min(6),
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {
    name,
    author_name,
    email,
    whatsapp,
    password,
    cep,
    state,
    city,
    neighborhood,
    street,
    latitude,
    longitude,
  } = registerBodySchema.parse(request.body)

  try {
    const registerOrgUseCase = makeRegisterOrgUseCase()

    await registerOrgUseCase.execute({
      name,
      author_name,
      email,
      whatsapp,
      password,
      cep,
      state,
      city,
      neighborhood,
      street,
      latitude,
      longitude,
    })
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
} 