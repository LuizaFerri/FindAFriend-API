import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { randomUUID } from 'node:crypto'

describe('Register ORG (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const uniqueId = randomUUID()
    const response = await request(app.server).post('/orgs').send({
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email: `john-${uniqueId}@petparadise.com`,
      whatsapp: '11999999999',
      password: '123456',
      cep: '01234-567',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua das Flores, 123',
      latitude: -23.550520,
      longitude: -46.633309,
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to register with duplicate email', async () => {
    const uniqueId = randomUUID()
    const orgData = {
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email: `duplicate-${uniqueId}@petparadise.com`,
      whatsapp: '11999999999',
      password: '123456',
      cep: '01234-567',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua das Flores, 123',
      latitude: -23.550520,
      longitude: -46.633309,
    }

    await request(app.server).post('/orgs').send(orgData)

    const response = await request(app.server).post('/orgs').send(orgData)

    expect(response.statusCode).toEqual(409)
  })

  it('should not be able to register with invalid data', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email: 'invalid-email',
      whatsapp: '11999999999',
      password: '123',
      cep: '01234-567',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua das Flores, 123',
      latitude: -23.550520,
      longitude: -46.633309,
    })

    expect(response.statusCode).toEqual(400)
  })
}) 