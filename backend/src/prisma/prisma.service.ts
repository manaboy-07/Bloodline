import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from './generated/prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // ensures process.env.DATABASE_URL is loaded
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Use the adapter from Prisma 7+ example
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL, // note: connectionString key
    });

    super({ adapter }); // pass adapter to PrismaClient
  }

  async onModuleInit() {
    await this.$connect(); // connect to DB when module starts
    console.log('Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect(); // disconnect cleanly when module shuts down
    console.log('Prisma disconnected from database');
  }
}
