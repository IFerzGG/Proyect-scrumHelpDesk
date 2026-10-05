import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(configService:ConfigService){
        const connectionString = configService.getOrThrow<string>('DATABASE_URL');
        const pool = new pg.Pool({connectionString});
        const adapter = new PrismaPg(pool);
        super({adapter});
    }

    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
