import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { User } from './entity/user.entity';
import { UserType } from './entity/user.type.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserTypeModule } from './user-type/user-type.module';
import { TokenDetails } from 'src/utills/token_details';
import { HttpModule } from '@nestjs/axios';
import { AuditDetailService } from 'src/utills/audit_detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserType, Institution, Country,Audit]), UserTypeModule, HttpModule],
  providers: [UsersService, EmailNotificationService,AuditService,  TokenDetails, AuditDetailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
