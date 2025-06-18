import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Get Pet Details (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet details', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const createResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field('name', 'Buddy')
      .field('about', 'A friendly dog')
      .field('age', 'ADULTO')
      .field('size', 'MEDIO')
      .field('energy_level', '03')
      .field('independence', 'MEDIO')
      .field('environment', 'QUINTAL_PEQUENO')
      .field('adoption_requirements', JSON.stringify(['Ter experiência com cães']))

    const petId = createResponse.body.pet.id

    const response = await request(app.server).get(`/pets/${petId}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: petId,
        name: 'Buddy',
        about: 'A friendly dog',
        age: 'ADULTO',
        size: 'MEDIO',
        energy_level: '03',
        independence: 'MEDIO',
        environment: 'QUINTAL_PEQUENO',
        adoption_requirements: ['Ter experiência com cães'],
      }),
    )
  })

  it('should not be able to get details of non-existing pet', async () => {
    const response = await request(app.server).get(
      '/pets/9e9e9e9e-9e9e-9e9e-9e9e-9e9e9e9e9e9e',
    )

    expect(response.statusCode).toEqual(404)
  })

  it('should not be able to get details with invalid pet id format', async () => {
    const response = await request(app.server).get('/pets/invalid-id')

    expect(response.statusCode).toEqual(400)
  })
}) 