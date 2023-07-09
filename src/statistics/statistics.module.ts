import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService as Uservice } from 'src/db-services/user-service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService, Uservice],
  imports: [UserModule]
})
export class StatisticsModule {}
