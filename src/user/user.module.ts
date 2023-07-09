import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService as UService } from 'src/db-services/user-service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UService ],
  exports: [UserService]
})
export class UserModule {}
