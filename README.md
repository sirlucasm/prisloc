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
import { Prisloc } from 'prisloc'

// Initialize Prisloc
const prisloc = new Prisloc('./data')

// Define your model
const User = prisloc.defineModel({
  name: 'User',
  fields: {
    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    age: {
      type: 'number',
    },
  },
})

// Use the model
async function main() {
  // Create
  const user = await User.create({
    email: 'john@example.com',
    name: 'John Doe',
    age: 30,
  })

  // Read
  const users = await User.findMany({
    where: {
      age: { gt: 25 },
    },
  })

  // Update
  const updated = await User.update({ email: 'john@example.com' }, { age: 31 })

  // Delete
  const deleted = await User.delete({
    email: 'john@example.com',
  })
}
```
