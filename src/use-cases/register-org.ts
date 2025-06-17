import { OrgsRepository } from "@/repositories/orgs-repository";
import { hash } from "bcryptjs";
import { OrgAlreadyExistsError } from "./errors/org-already-exists-error";
import { Org } from "@prisma/client";

interface RegisterOrgUseCaseRequest {
  name: string;
  author_name: string;
  email: string;
  whatsapp: string;
  password: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  latitude: number;
  longitude: number;
}

interface RegisterOrgUseCaseResponse {
  org: Org;
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    author_name,
    email,
    whatsapp,
    password,
    cep,
    state,
    city,
    neighborhood,
    street,
    latitude,
    longitude,
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email);

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    if (!cep || !state || !city || !neighborhood || !street) {
      throw new Error("Complete address is required.");
    }

    if (!whatsapp) {
      throw new Error("WhatsApp number is required.");
    }

    const org = await this.orgsRepository.create({
      name,
      author_name,
      email,
      whatsapp,
      password: password_hash,
      cep,
      state,
      city,
      neighborhood,
      street,
      latitude,
      longitude,
    });

    return {
      org,
    };
  }
}
