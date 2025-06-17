import { describe, it, expect, beforeEach } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    const org = await orgsRepository.create({
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

    const { pet } = await sut.execute({
      name: 'Buddy',
      about: 'A friendly dog',
      age: 'ADULTO',
      size: 'MEDIO',
      energy_level: '03',
      independence: 'MEDIO',
      environment: 'QUINTAL_PEQUENO',
      adoption_requirements: ['Ter experiência com cães'],
      org_id: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toEqual('Buddy')
  })

  it('should not be able to create a pet with invalid org', async () => {
    await expect(() =>
      sut.execute({
        name: 'Buddy',
        about: 'A friendly dog',
        age: 'ADULTO',
        size: 'MEDIO',
        energy_level: '03',
        independence: 'MEDIO',
        environment: 'QUINTAL_PEQUENO',
        adoption_requirements: ['Ter experiência com cães'],
        org_id: 'non-existing-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a pet without name', async () => {
    const org = await orgsRepository.create({
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

    await expect(() =>
      sut.execute({
        name: '',
        about: 'A friendly dog',
        age: 'ADULTO',
        size: 'MEDIO',
        energy_level: '03',
        independence: 'MEDIO',
        environment: 'QUINTAL_PEQUENO',
        adoption_requirements: ['Ter experiência com cães'],
        org_id: org.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a pet with invalid age', async () => {
    const org = await orgsRepository.create({
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

    await expect(() =>
      sut.execute({
        name: 'Buddy',
        about: 'A friendly dog',
        age: 'INVALID_AGE',
        size: 'MEDIO',
        energy_level: '03',
        independence: 'MEDIO',
        environment: 'QUINTAL_PEQUENO',
        adoption_requirements: ['Ter experiência com cães'],
        org_id: org.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a pet without adoption requirements', async () => {
    const org = await orgsRepository.create({
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

    await expect(() =>
      sut.execute({
        name: 'Buddy',
        about: 'A friendly dog',
        age: 'ADULTO',
        size: 'MEDIO',
        energy_level: '03',
        independence: 'MEDIO',
        environment: 'QUINTAL_PEQUENO',
        adoption_requirements: [],
        org_id: org.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
}) 