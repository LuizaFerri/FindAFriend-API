import {
  PetsRepository,
  FindManyNearbyParams,
} from "@/repositories/pets-repository";
import { Pet } from "@prisma/client";

interface SearchPetsUseCaseRequest {
  city: string;
  age?: string;
  size?: string;
  energy_level?: string;
  independence?: string;
  environment?: string;
}

interface SearchPetsUseCaseResponse {
  pets: Pet[];
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    age,
    size,
    energy_level,
    independence,
    environment,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    if (!city || city.trim() === "") {
      throw new Error("City is required to search pets.");
    }

    const pets = await this.petsRepository.findManyByCity({
      city,
      age,
      size,
      energy_level,
      independence,
      environment,
    });

    return {
      pets,
    };
  }
}
