import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslController } from './casl.controller';
import { CaslService } from './casl.service';

@Module({
    controllers: [CaslController],
    providers: [CaslService, CaslAbilityFactory, PrismaService],
    exports: [CaslAbilityFactory],
})
export class CaslModule {}
