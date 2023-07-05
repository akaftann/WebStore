import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../db-services/user-service';


@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, ConfigService, UserService],
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: getJwtConfig
  })]
})
export class AuthModule {}
