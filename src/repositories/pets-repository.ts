import { Pet, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  city: string
  age?: string
  size?: string
  energy_level?: string
  independence?: string
  environment?: string
}

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  findManyByCity(params: FindManyNearbyParams): Promise<Pet[]>
  create(data: Prisma.PetCreateInput): Promise<Pet>
} 