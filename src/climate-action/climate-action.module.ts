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

@Module({
  imports: [TypeOrmModule.forFeature([ClimateAction,PolicyBarriers,PolicySector,])],
  controllers: [ProjectController],
  providers: [ProjectService, EmailNotificationService,PolicyBarriers,TokenDetails,PolicySector],
  exports: [ProjectService],
})
export class ProjectModule {}
