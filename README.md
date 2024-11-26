# Prisloc

A local-first Prisma-like ORM for TypeScript that saves data to local files.

## Features

- Prisma-like API
- Local file storage
- TypeScript support with automatic type generation
- Simple and lightweight
- No database required

## Installation

```bash
npm install prisloc
# or
yarn add prisloc
# or
pnpm add prisloc
```

## Quick Start

```typescript
// prisloc/config.ts
import { PrislocConfig } from 'prisloc'

const config: PrislocConfig = {
  dataPath: './data',
  models: [
    {
      name: 'User',
      map: 'usuarios', // Nome personalizado no armazenamento
      fields: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        department: {
          type: 'map',
          relation: {
            model: 'Department',
            reference: 'code',
          },
        },
      },
    },
    {
      name: 'Department',
      fields: {
        code: { type: 'string', required: true },
        name: { type: 'string', required: true },
      },
    },
  ],
}

export default config

// Uso na aplicação
import { PrislocClient } from 'prisloc'
import config from './prisloc/config'

const client = new PrislocClient(config)

// Criando um departamento
const department = await client.create('Department', {
  code: 'IT',
  name: 'Tecnologia da Informação',
})

// Criando um usuário com relacionamento
const user = await client.create('User', {
  name: 'João Silva',
  department: department.code,
})
```
