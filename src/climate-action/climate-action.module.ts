import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ClimateAction } from './entity/climate-action.entity';
import { ProjectController } from './climate-action.controller';
import { ProjectService } from './climate-action.service';
import { PolicyBarriers } from './entity/policy-barriers.entity';
import { TokenDetails } from 'src/utills/token_details';
import { PolicySector } from './entity/policy-sectors.entity';
import { Sector } from 'src/master-data/sector/entity/sector.entity';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/users/entity/user.type.entity';
import { User } from 'src/users/entity/user.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { Country } from 'src/country/entity/country.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { BarrierCategory } from './entity/barrier-category.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClimateAction,PolicyBarriers,PolicySector,  Results, User, UserType, Institution, Country,Audit,BarrierCategory])],
  controllers: [ProjectController],
  providers: [ProjectService, EmailNotificationService,PolicyBarriers,TokenDetails,PolicySector, UsersService,BarrierCategory],
  exports: [ProjectService],
})
export class ProjectModule {}
