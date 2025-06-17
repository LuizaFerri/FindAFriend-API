import { Prisma, Pet } from '@prisma/client'
import { FindManyNearbyParams, PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
      include: {
        org: true,
      },
    })

    return pet
  }

  async findManyByCity(params: FindManyNearbyParams) {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city: {
            contains: params.city,
            mode: 'insensitive',
          },
        },
        age: params.age ? params.age : undefined,
        size: params.size ? params.size : undefined,
        energy_level: params.energy_level ? params.energy_level : undefined,
        independence: params.independence ? params.independence : undefined,
        environment: params.environment ? params.environment : undefined,
      },
      include: {
        org: true,
      },
    })

    return pets
  }

  async create(data: Prisma.PetCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
} 