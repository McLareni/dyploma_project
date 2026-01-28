import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

export const prisma =
  globalForPrisma.prisma ??
  (prismaClient as InstanceType<typeof PrismaClient>);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
