import fastify from 'fastify'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import path from 'node:path'
import { ZodError } from 'zod'
import { env } from './env'
import { orgsRoutes } from './http/controllers/orgs/routes'
import { petsRoutes } from './http/controllers/pets/routes'

export const app = fastify()

if (env.NODE_ENV !== 'production') {
  app.register(swagger, {
    swagger: {
      info: {
        title: 'FindAFriend API',
        description: 'API para adoção de pets - conectando animais a famílias amorosas',
        version: '1.0.0',
        contact: {
          name: 'FindAFriend Team',
          email: 'contact@findafriend.com',
        },
      },
      host: 'localhost:3333',
      schemes: ['http'],
      consumes: ['application/json', 'multipart/form-data'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT token. Formato: Bearer {token}',
        },
      },
      tags: [
        {
          name: 'ORGs',
          description: 'Operações relacionadas às organizações',
        },
        {
          name: 'Pets',
          description: 'Operações relacionadas aos pets',
        },
        {
          name: 'Auth',
          description: 'Autenticação e autorização',
        },
      ],
    },
  })

  app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
  })
}

app.register(jwt, {
  secret: env.JWT_SECRET,
})

app.register(cookie)

app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // máximo 10 arquivos
  },
})

app.register(staticFiles, {
  root: path.join(process.cwd(), 'uploads'),
  prefix: '/uploads/',
})

app.register(orgsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
}) 