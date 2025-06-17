import { describe, it, expect, beforeEach } from 'vitest'
import { SearchPetsUseCase } from './search-pets'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('Search Pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should be able to search pets by city', async () => {
    const { pets } = await sut.execute({
      city: 'São Paulo',
    })

    expect(pets).toEqual([])
  })

  it('should not be able to search pets without city', async () => {
    await expect(() =>
      sut.execute({
        city: '',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to search pets with filters', async () => {
    const { pets } = await sut.execute({
      city: 'São Paulo',
      age: 'ADULTO',
      size: 'MEDIO',
      energy_level: '03',
    })

    expect(pets).toEqual([])
  })
}) 