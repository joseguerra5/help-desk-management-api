import { config } from "dotenv"

import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { execSync } from "child_process"

// essa config faz com que quando rode os testes as variaveis ambiente consigam subscrever+
config({ path: ".env", override: true })
config({ path: ".env.test", override: true })

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable")
  }
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set("schema", schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  execSync("npx prisma migrate deploy")
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})