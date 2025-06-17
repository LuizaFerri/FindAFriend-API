import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterOrgUseCase } from './register-org'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { compare } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register ORG Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register a new org', async () => {
    const { org } = await sut.execute({
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email: 'john@petparadise.com',
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

    expect(org.id).toEqual(expect.any(String))
    expect(org.email).toEqual('john@petparadise.com')
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'Pet Paradise',
      author_name: 'John Doe',
      email: 'john@petparadise.com',
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

    const isPasswordCorrectlyHashed = await compare('123456', org.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'john@petparadise.com'

    await sut.execute({
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

    await expect(() =>
      sut.execute({
        name: 'Another Org',
        author_name: 'Jane Doe',
        email,
        whatsapp: '11888888888',
        password: '654321',
        cep: '09876-543',
        state: 'RJ',
        city: 'Rio de Janeiro',
        neighborhood: 'Copacabana',
        street: 'Avenida Atlântica, 456',
        latitude: -22.906847,
        longitude: -43.172896,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })

  it('should not be able to register without complete address', async () => {
    await expect(() =>
      sut.execute({
        name: 'Pet Paradise',
        author_name: 'John Doe',
        email: 'john@petparadise.com',
        whatsapp: '11999999999',
        password: '123456',
        cep: '',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua das Flores, 123',
        latitude: -23.550520,
        longitude: -46.633309,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to register without WhatsApp', async () => {
    await expect(() =>
      sut.execute({
        name: 'Pet Paradise',
        author_name: 'John Doe',
        email: 'john@petparadise.com',
        whatsapp: '',
        password: '123456',
        cep: '01234-567',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua das Flores, 123',
        latitude: -23.550520,
        longitude: -46.633309,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
}) 