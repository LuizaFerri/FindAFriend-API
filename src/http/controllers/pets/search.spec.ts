import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Search Pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pets by city', async () => {
    const { token } = await createAndAuthenticateOrg(app, 'SearchCity1')

    await request(app.server)
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

    const response = await request(app.server)
      .get('/pets/search')
      .query({
        city: 'SearchCity1',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Buddy',
        age: 'ADULTO',
        size: 'MEDIO',
      }),
    )
  })

  it('should be able to search pets with filters', async () => {
    const { token } = await createAndAuthenticateOrg(app, 'SearchCity2')

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field('name', 'Rex')
      .field('age', 'FILHOTE')
      .field('size', 'GRANDE')
      .field('energy_level', '05')
      .field('independence', 'ALTO')
      .field('environment', 'QUINTAL_GRANDE')
      .field('adoption_requirements', JSON.stringify(['Casa com quintal grande']))

    const response = await request(app.server)
      .get('/pets/search')
      .query({
        city: 'SearchCity2',
        age: 'FILHOTE',
        size: 'GRANDE',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Rex',
        age: 'FILHOTE',
        size: 'GRANDE',
      }),
    )
  })

  it('should not be able to search pets without city', async () => {
    const response = await request(app.server).get('/pets/search')

    expect(response.statusCode).toEqual(400)
  })

  it('should return empty array when no pets found', async () => {
    const response = await request(app.server)
      .get('/pets/search')
      .query({
        city: 'Cidade Inexistente',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(0)
  })
}) 