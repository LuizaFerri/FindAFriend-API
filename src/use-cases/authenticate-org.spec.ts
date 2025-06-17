import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateOrgUseCase } from './authenticate-org'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateOrgUseCase

describe('Authenticate ORG Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOrgUseCase(orgsRepository)
  })

  it('should be able to authenticate', async () => {
    await orgsRepository.create({
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email: 'john@petparadise.com',
      whatsapp: '11999999999',
      password: await hash('123456', 6),
      cep: '01234-567',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua das Flores, 123',
      latitude: -23.550520,
      longitude: -46.633309,
    })

    const { org } = await sut.execute({
      email: 'john@petparadise.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'john@petparadise.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await orgsRepository.create({
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email: 'john@petparadise.com',
      whatsapp: '11999999999',
      password: await hash('123456', 6),
      cep: '01234-567',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua das Flores, 123',
      latitude: -23.550520,
      longitude: -46.633309,
    })

    await expect(() =>
      sut.execute({
        email: 'john@petparadise.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
}) 