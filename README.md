# 🐾 FindAFriend API

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

<div align="center">
  <p>API REST completa para adoção de animais de estimação</p>
</div>

---

## 📋 Índice

- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [📋 Pré-requisitos](#-pré-requisitos)
- [🚀 Como Executar](#-como-executar)
- [🐳 Docker](#-docker)
- [📚 Documentação da API](#-documentação-da-api)
- [🧪 Testes](#-testes)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🤝 Como Contribuir](#-como-contribuir)
- [📄 Licença](#-licença)

---

## 📖 Sobre o Projeto

A **FindAFriend API** é uma aplicação backend robusta para facilitar a adoção de pets. O sistema permite que organizações cadastrem animais disponíveis para adoção e que usuários busquem pets por localização e características específicas.

### 🎯 Objetivo

Criar uma ponte entre pets que precisam de um lar e famílias que desejam adotar, utilizando tecnologia para facilitar esse encontro especial.

---

## ✨ Funcionalidades

### 🏢 Organizações (ORGs)
- ✅ **Cadastro de organizações** com dados completos de localização
- ✅ **Autenticação JWT** para acesso seguro
- ✅ **Validação de email único** para evitar duplicatas

### 🐕 Pets
- ✅ **Cadastro de pets** com características detalhadas
- ✅ **Upload de múltiplas fotos** (até 10 imagens, 5MB cada)
- ✅ **Busca por cidade** (obrigatória) e filtros opcionais
- ✅ **Filtros avançados**: idade, porte, energia, independência, ambiente
- ✅ **Detalhes completos** do pet e organização responsável

### 🔐 Segurança
- ✅ **Autenticação JWT** com Bearer Token
- ✅ **Validação robusta** com Zod
- ✅ **Middleware de verificação** para rotas protegidas
- ✅ **Criptografia de senhas** com bcryptjs

### 📊 Qualidade
- ✅ **32 testes** (16 unitários + 16 E2E)
- ✅ **Cobertura completa** de funcionalidades
- ✅ **Clean Architecture** com SOLID
- ✅ **Documentação interativa** com Swagger

---

## 🛠️ Tecnologias

### 🔧 Backend
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Fastify](https://www.fastify.io/)** - Framework web rápido e eficiente
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript

### 🗄️ Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco relacional robusto

### 🔐 Autenticação & Validação
- **[@fastify/jwt](https://github.com/fastify/fastify-jwt)** - JWT para autenticação
- **[Zod](https://zod.dev/)** - Validação de esquemas TypeScript-first

### 📁 Upload & Storage
- **[@fastify/multipart](https://github.com/fastify/fastify-multipart)** - Upload de arquivos
- **[@fastify/static](https://github.com/fastify/fastify-static)** - Servir arquivos estáticos

### 🧪 Testes
- **[Vitest](https://vitest.dev/)** - Framework de testes rápido
- **[Supertest](https://github.com/visionmedia/supertest)** - Testes HTTP

### 📚 Documentação
- **[@fastify/swagger](https://github.com/fastify/fastify-swagger)** - Documentação automática
- **[@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui)** - Interface interativa

### 🐳 DevOps
- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers

---

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Docker** & **Docker Compose** (opcional, mas recomendado)



## 📚 Documentação da API

### 🌐 Swagger UI Interativo
Acesse: **http://localhost:3333/docs**

A documentação inclui:
- 📝 **Esquemas completos** de request/response
- 🔐 **Autenticação JWT** integrada
- 🧪 **Testes interativos** de todas as rotas
- 📋 **Exemplos práticos** de uso

### 🛣️ Principais Endpoints

#### 🏢 Organizações
- `POST /orgs` - Cadastrar organização
- `POST /sessions` - Autenticar organização

#### 🐕 Pets
- `POST /pets` - Cadastrar pet (requer autenticação)
- `GET /pets/search` - Buscar pets por cidade e filtros
- `GET /pets/:id` - Detalhes do pet

### 🔑 Autenticação
1. Registre uma organização em `POST /orgs`
2. Faça login em `POST /sessions`
3. Use o token retornado no header: `Authorization: Bearer {token}`

---

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Testes por categoria
```bash
# Testes unitários (use cases)
npm run test:watch

# Testes E2E (rotas HTTP)
npm run test:e2e

# Coverage
npm run test:coverage
```

### 📊 Cobertura de Testes
- ✅ **16 testes unitários** - Use cases e regras de negócio
- ✅ **16 testes E2E** - Rotas HTTP completas
- ✅ **100% das funcionalidades** cobertas

---

## 📁 Estrutura do Projeto

```
src/
├── 📁 @types/           # Tipos TypeScript
├── 📁 env/              # Configuração de ambiente
├── 📁 http/             # Camada HTTP
│   ├── 📁 controllers/   # Controllers das rotas
│   └── 📁 middlewares/   # Middlewares (auth, etc)
├── 📁 lib/              # Configurações de bibliotecas
├── 📁 repositories/     # Camada de dados
│   ├── 📁 in-memory/     # Repos para testes
│   └── 📁 prisma/        # Implementação Prisma
├── 📁 use-cases/        # Regras de negócio
│   ├── 📁 errors/        # Erros customizados
│   └── 📁 factories/     # Factories dos use cases
└── 📁 utils/            # Utilitários
```

### 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**:

- **🌐 HTTP Layer**: Controllers, rotas e middlewares
- **💼 Business Layer**: Use cases com regras de negócio
- **🗄️ Data Layer**: Repositórios e acesso aos dados
- **🔧 External Layer**: Frameworks, banco de dados, APIs
