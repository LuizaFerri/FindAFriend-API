import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { createWriteStream } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'

const pump = promisify(pipeline)

export interface UploadedFile {
  filename: string
  filepath: string
  url: string
}

export async function saveUploadedFile(
  data: AsyncIterable<Buffer>,
  filename: string,
  mimetype: string,
): Promise<UploadedFile> {
  // Validar tipo de arquivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.')
  }

  // Gerar nome único para o arquivo
  const fileExtension = path.extname(filename)
  const uniqueFilename = `${randomUUID()}${fileExtension}`

  // Criar diretório se não existir
  const uploadDir = path.join(process.cwd(), 'uploads', 'pets')
  await mkdir(uploadDir, { recursive: true })

  // Caminho completo do arquivo
  const filepath = path.join(uploadDir, uniqueFilename)

  // Salvar arquivo
  await pump(data, createWriteStream(filepath))

  return {
    filename: uniqueFilename,
    filepath,
    url: `/uploads/pets/${uniqueFilename}`,
  }
} 