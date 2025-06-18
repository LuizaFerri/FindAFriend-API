import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { randomUUID } from 'node:crypto'

describe('Authenticate ORG (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const uniqueId = randomUUID()
    const email = `john-${uniqueId}@petparadise.com`
    
    await request(app.server).post('/orgs').send({
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email,
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

    const response = await request(app.server).post('/sessions').send({
      email,
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'john@petparadise.com',
      password: 'wrong-password',
    })

    expect(response.statusCode).toEqual(400)
  })

  it('should not be able to authenticate with invalid email format', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'invalid-email',
      password: '123456',
    })

    expect(response.statusCode).toEqual(400)
  })
}) 