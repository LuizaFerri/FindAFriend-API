import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateOrgUseCase } from '@/use-cases/factories/make-authenticate-org-use-case'

export const authenticateOrgSchema = {
  description: 'Autenticar uma organização',
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', description: 'Email da organização' },
      password: { type: 'string', description: 'Senha da organização' },
    },
  },
  response: {
    200: {
      description: 'Autenticação realizada com sucesso',
      type: 'object',
      properties: {
        token: { type: 'string', description: 'JWT token para autenticação' },
      },
    },
    400: {
      description: 'Credenciais inválidas ou dados malformados',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: { type: 'object' },
      },
    },
  },
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateOrgUseCase = makeAuthenticateOrgUseCase()

    const { org } = await authenticateOrgUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
} 