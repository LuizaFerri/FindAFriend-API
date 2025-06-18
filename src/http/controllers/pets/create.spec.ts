import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Create Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
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

    expect(response.statusCode).toEqual(201)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Buddy',
        age: 'ADULTO',
        size: 'MEDIO',
      }),
    )
  })

  it('should not be able to create a pet without authentication', async () => {
    const response = await request(app.server)
      .post('/pets')
      .set('Content-Type', 'multipart/form-data')
      .field('name', 'Buddy')
      .field('age', 'ADULTO')
      .field('size', 'MEDIO')
      .field('energy_level', '03')
      .field('independence', 'MEDIO')
      .field('environment', 'QUINTAL_PEQUENO')
      .field('adoption_requirements', JSON.stringify(['Ter experiência com cães']))

    expect(response.statusCode).toEqual(401)
  })

  it('should not be able to create a pet with invalid data', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field('name', '')
      .field('age', 'INVALID_AGE')
      .field('size', 'MEDIO')
      .field('energy_level', '03')
      .field('independence', 'MEDIO')
      .field('environment', 'QUINTAL_PEQUENO')
      .field('adoption_requirements', JSON.stringify(['Ter experiência com cães']))

    expect(response.statusCode).toEqual(400)
  })
}) 