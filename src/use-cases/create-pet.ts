import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Pet } from '@prisma/client'

interface CreatePetUseCaseRequest {
  name: string
  about?: string
  age: string
  size: string
  energy_level: string
  independence: string
  environment: string
  adoption_requirements: string[]
  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energy_level,
    independence,
    environment,
    adoption_requirements,
    org_id,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    if (!name || name.trim() === '') {
      throw new Error('Pet name is required.')
    }

    const validAges = ['FILHOTE', 'ADULTO', 'IDOSO']
    const validSizes = ['PEQUENO', 'MEDIO', 'GRANDE']
    const validEnergyLevels = ['01', '02', '03', '04', '05']
    const validIndependence = ['BAIXO', 'MEDIO', 'ALTO']
    const validEnvironments = ['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE']

    if (!validAges.includes(age)) {
      throw new Error('Invalid age value.')
    }

    if (!validSizes.includes(size)) {
      throw new Error('Invalid size value.')
    }

    if (!validEnergyLevels.includes(energy_level)) {
      throw new Error('Invalid energy level value.')
    }

    if (!validIndependence.includes(independence)) {
      throw new Error('Invalid independence value.')
    }

    if (!validEnvironments.includes(environment)) {
      throw new Error('Invalid environment value.')
    }

    if (!adoption_requirements || adoption_requirements.length === 0) {
      throw new Error('At least one adoption requirement is needed.')
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      size,
      energy_level,
      independence,
      environment,
      adoption_requirements,
      org: {
        connect: {
          id: org_id,
        },
      },
    })

    return {
      pet,
    }
  }
} 