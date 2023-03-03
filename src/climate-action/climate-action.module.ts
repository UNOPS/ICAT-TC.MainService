import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ClimateAction } from './entity/climate-action.entity';
import { ProjectController } from './climate-action.controller';
import { ProjectService } from './climate-action.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClimateAction])],
  controllers: [ProjectController],
  providers: [ProjectService, EmailNotificationService],
  exports: [ProjectService],
})
export class ProjectModule {}
