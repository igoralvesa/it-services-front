import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
  { id: 1, name: 'Service Desk mensal 8x5', price: 680.0, leadDays: 3 },
  { id: 2, name: 'Migração Microsoft 365', price: 1850.0, leadDays: 12 },
  { id: 3, name: 'Auditoria de segurança básica', price: 1250.0, leadDays: 7 },
  { id: 4, name: 'Implantação de backup em nuvem', price: 980.0, leadDays: 6 }
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {
        name: service.name,
        price: service.price,
        leadDays: service.leadDays
      },
      create: service
    });
  }

  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Service"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Service"), 1),
      true
    )
  `;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
