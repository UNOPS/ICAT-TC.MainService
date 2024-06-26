import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { Audit } from './entity/audit.entity';
import { TokenDetails } from 'src/utills/token_details';

@Module({
  imports: [TypeOrmModule.forFeature([Audit, User])],
  controllers: [AuditController],
  providers: [AuditService,TokenDetails],
  exports: [AuditService]
})
export class AuditModule {

}
