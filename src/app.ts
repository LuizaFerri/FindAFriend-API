import fastify from 'fastify'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import path from 'node:path'
import { ZodError } from 'zod'
import { env } from './env'
import { orgsRoutes } from './http/controllers/orgs/routes'
import { petsRoutes } from './http/controllers/pets/routes'

export const app = fastify()

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