import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from 'src/institution/entity/institution.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { User } from 'src/users/entity/user.entity';
import { Country } from 'src/country/entity/country.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { HttpModule } from '@nestjs/axios';
import { TokenDetails } from 'src/utills/token_details';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
    }),
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret:process.env.JWT_VERIFICATION_TOKEN_SECRET ,
      signOptions: { expiresIn: jwtConstants.JWT_expiresIn },
    }),
    TypeOrmModule.forFeature([Institution, UserType, User, Country,Audit]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailNotificationService,
    UsersService,
    AuditService,
    TokenDetails
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
