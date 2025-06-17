export class OrgAlreadyExistsError extends Error {
  constructor() {
    super('ORG with same email already exists.')
  }
} 