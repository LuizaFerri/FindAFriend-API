export const orgSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    author_name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    whatsapp: { type: 'string' },
    cep: { type: 'string' },
    state: { type: 'string' },
    city: { type: 'string' },
    neighborhood: { type: 'string' },
    street: { type: 'string' },
    latitude: { type: 'number' },
    longitude: { type: 'number' },
    created_at: { type: 'string', format: 'date-time' },
  },
} as const

export const petSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    about: { type: 'string', nullable: true },
    age: { 
      type: 'string', 
      enum: ['FILHOTE', 'ADULTO', 'IDOSO'],
      description: 'Idade do pet'
    },
    size: { 
      type: 'string', 
      enum: ['PEQUENO', 'MEDIO', 'GRANDE'],
      description: 'Porte do pet'
    },
    energy_level: { 
      type: 'string', 
      enum: ['01', '02', '03', '04', '05'],
      description: 'Nível de energia (1-5)'
    },
    independence: { 
      type: 'string', 
      enum: ['BAIXO', 'MEDIO', 'ALTO'],
      description: 'Nível de independência'
    },
    environment: { 
      type: 'string', 
      enum: ['APARTAMENTO', 'CASA', 'QUINTAL_PEQUENO', 'QUINTAL_GRANDE'],
      description: 'Ambiente adequado'
    },
    adoption_requirements: {
      type: 'array',
      items: { type: 'string' },
      description: 'Requisitos para adoção'
    },
    photos: {
      type: 'array',
      items: { type: 'string', format: 'uri' },
      description: 'URLs das fotos do pet'
    },
    org_id: { type: 'string', format: 'uuid' },
    created_at: { type: 'string', format: 'date-time' },
  },
} as const

export const errorSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    issues: { 
      type: 'object',
      description: 'Detalhes dos erros de validação (quando aplicável)'
    },
  },
} as const

export const tokenSchema = {
  type: 'object',
  properties: {
    token: { type: 'string', description: 'JWT token para autenticação' },
  },
} as const 