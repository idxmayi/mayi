const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const userId = 'demo-user-id'
  
  const upsertUser = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'demo@example.com',
      password_hash: 'hashed_password_here',
    },
  })

  console.log({ upsertUser })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
