import { Pet, Prisma } from '@prisma/client'
import { FindManyNearbyParams, PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findManyByCity(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      return (
        item.org_id &&
        (!params.age || item.age === params.age) &&
        (!params.size || item.size === params.size) &&
        (!params.energy_level || item.energy_level === params.energy_level) &&
        (!params.independence || item.independence === params.independence) &&
        (!params.environment || item.environment === params.environment)
      )
    })
  }

  async create(data: Prisma.PetCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about ?? null,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      independence: data.independence,
      environment: data.environment,
      adoption_requirements: data.adoption_requirements as string[],
      photos: (data.photos as string[]) ?? [],
      org_id: data.org?.connect?.id ?? '',
      created_at: new Date(),
    }

    this.items.push(pet)

    return pet
  }
} 