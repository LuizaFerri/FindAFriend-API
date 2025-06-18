import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { randomUUID } from 'node:crypto'

export async function createAndAuthenticateOrg(app: FastifyInstance, city = 'São Paulo') {
  const uniqueId = randomUUID()
  const orgData = {
    name: 'Test Org',
    author_name: 'John Doe',
    email: `john-${uniqueId}@testorg.com`,
    whatsapp: '11999999999',
    password: '123456',
    cep: '01234-567',
    state: 'SP',
    city,
    neighborhood: 'Centro',
    street: 'Rua das Flores, 123',
    latitude: -23.550520,
    longitude: -46.633309,
  }

  await request(app.server).post('/orgs').send(orgData)

  const authResponse = await request(app.server).post('/sessions').send({
    email: `john-${uniqueId}@testorg.com`,
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
} 