import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });


async function main() {
  const hashedPassword = await bcrypt.hash('securepassword', 10);

  // Seed roles
  const roles = ['ADMIN', 'USER'];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
  console.log('Roles successfully seeded');


  const users = [
    { email: 'john@bdadmin.com', name: 'John Admin', password: 'password123' },
    {
      email: 'janeuser.com',
      name: 'Jane user',
      password: 'password123',
    },
    {
      email: 'bob@user.com',
      name: 'Bob user',
      password: 'password123',
    },
  ];

  for (const u of users) {
    const roleName = u.email.endsWith('@bdadmin.com') ? 'ADMIN' : 'USER';

    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new Error(`Role ${roleName} not found.`);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        role: { connect: { id: role.id} }, 
      },
    });
  }
  console.log('✅ Users seeded');
}
//npx prisma db seed
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
